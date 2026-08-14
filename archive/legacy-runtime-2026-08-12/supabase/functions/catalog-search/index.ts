import { createClient } from 'npm:@supabase/supabase-js@2';

const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:5173',
  'https://jrambackup1-lgtm.github.io',
]);
const rateLimitWindowSeconds = 60;
const rateLimitMaxRequests = 60;
const maxResults = 25;
const maxQueryLength = 200;

const filterFields = new Set(['family', 'type', 'thread', 'pitch', 'length', 'head', 'material', 'finish', 'drive', 'strength', 'standard']);


type SearchRequest = {
  query?: unknown;
  family?: unknown;
  filters?: unknown;
};

type Filters = Record<string, string>;

function corsHeaders(origin: string | null) {
  if (!origin || !allowedOrigins.has(origin)) return {};

  return {
    'access-control-allow-origin': origin,
    'access-control-allow-headers': 'authorization, content-type',
    'access-control-allow-methods': 'POST, OPTIONS',
    vary: 'Origin',
  };
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'content-type': 'application/json' },
  });
}

function clientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('cf-connecting-ip')
    || 'unknown';
}

function parseRequest(body: SearchRequest): { query: string; family?: string; filters: Filters } | Response {
  const query = typeof body.query === 'string' ? body.query.trim() : '';
  if (!query) return new Response(JSON.stringify({ error: 'query is required' }), { status: 400 });
  if (query.length > maxQueryLength) return new Response(JSON.stringify({ error: 'query is too long' }), { status: 400 });
  if (/[%_]/.test(query)) return new Response(JSON.stringify({ error: 'query contains unsupported wildcard characters' }), { status: 400 });

  let family: string | undefined;
  if (body.family !== undefined) {
    if (typeof body.family !== 'string' || !['socket', 'hex', 'rounded'].includes(body.family)) {
      return new Response(JSON.stringify({ error: 'family must be socket, hex, or rounded' }), { status: 400 });
    }
    family = body.family;
  }

  const filters: Filters = {};
  if (body.filters !== undefined) {
    if (!body.filters || typeof body.filters !== 'object' || Array.isArray(body.filters)) {
      return new Response(JSON.stringify({ error: 'filters must be an object' }), { status: 400 });
    }

    for (const [field, value] of Object.entries(body.filters as Record<string, unknown>)) {
      if (!filterFields.has(field) || typeof value !== 'string' || !value.trim() || value.trim().length > maxQueryLength) {
        return new Response(JSON.stringify({ error: 'filters contain an invalid field or value' }), { status: 400 });
      }
      if (/[%_]/.test(value.trim())) {
        return new Response(JSON.stringify({ error: 'filters contain unsupported wildcard characters' }), { status: 400 });
      }
      if (field === 'family' && !['socket', 'hex', 'rounded'].includes(value.trim())) {
        return new Response(JSON.stringify({ error: 'family filter must be socket, hex, or rounded' }), { status: 400 });
      }
      filters[field] = value.trim();
    }
  }

  return { query, family, filters };
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin');
  const headers = corsHeaders(origin);

  if (origin && !allowedOrigins.has(origin)) return json({ error: 'origin is not allowed' }, 403, headers);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405, headers);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) return json({ error: 'server configuration error' }, 500, headers);

  let body: SearchRequest;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'body must be valid JSON' }, 400, headers);
  }

  const parsed = parseRequest(body);
  if (parsed instanceof Response) {
    const error = await parsed.json();
    return json(error, parsed.status, headers);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const rateLimit = await supabase.rpc('take_catalog_search_rate_limit', {
    p_key: clientIp(request),
    p_window_seconds: rateLimitWindowSeconds,
    p_max_requests: rateLimitMaxRequests,
  });

  if (rateLimit.error) {
    console.error('catalog-search rate limit failed', { code: rateLimit.error.code, message: rateLimit.error.message });
    return json({ error: 'search unavailable' }, 500, headers);
  }
  if (rateLimit.data === true) return json({ error: 'rate limit exceeded' }, 429, headers);

  const result = await supabase.rpc('search_catalog_configurations', {
    p_query: parsed.query,
    p_family: parsed.family ?? null,
    p_filters: parsed.filters,
  });

  if (result.error) {
    console.error('catalog-search query failed', { code: result.error.code, message: result.error.message });
    return json({ error: 'search unavailable' }, 500, headers);
  }

  return json({ results: (result.data ?? []).map(({ created_at: _createdAt, ...configuration }) => configuration) }, 200, headers);
});
