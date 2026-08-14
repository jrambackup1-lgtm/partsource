export const COMPLETE_RAW = [
  'family=socket_head_cap_screw',
  'head_profile=standard_profile',
  'drive=internal_hex',
  'thread=M3x0.5 mm',
  'thread_form=metric_m',
  'thread_role=external',
  'thread_series=coarse',
  'direction=right_hand',
  'tolerance=6g',
  'thread_extent=full',
  'length=10 mm under_head',
  'drive_size=2.5 mm',
  'assembly=plain',
  'material=alloy_steel',
  'finish=black_oxide',
  'property_class=12.9',
  'standard_reference=ISO 4762',
].join('; ');

function activeCatalog() {
  return {
    schemaVersion: 'ticket25/catalog-v1',
    activeManifestId: 'manifest-1',
    manifests: [{
      id: 'manifest-1',
      revision: '1',
      digest: 'sha256:ticket25-manifest-1',
      expectedDigest: 'sha256:ticket25-manifest-1',
      lifecycle: 'active',
    }],
    configurations: [{
      id: 'cfg-m3-10',
      revision: '1',
      manifestId: 'manifest-1',
      lifecycle: 'active',
      profileId: 'ticket25-shcs-metric-coarse-standard-internal-hex',
      facts: {
        productForm: 'socket_head_cap_screw',
        headProfile: 'standard_profile',
        driveType: 'internal_hex',
        threadSystem: 'metric',
        threadForm: 'metric_m',
        threadRole: 'external',
        threadSeries: 'coarse',
        diameter: '3',
        diameterUnit: 'mm',
        pitch: '0.5',
        pitchUnit: 'mm',
        threadDirection: 'right_hand',
        threadTolerance: '6g',
        threadExtent: 'full',
        length: '10',
        lengthUnit: 'mm',
        lengthBasis: 'under_head',
        driveSize: '2.5',
        driveSizeUnit: 'mm',
        assemblyForm: 'plain',
        material: 'alloy_steel',
        finish: 'black_oxide',
        propertyClass: '12.9',
        standardReference: 'ISO 4762',
      },
    }],
    mappings: [{
      id: 'map-ticket25-1',
      revision: '1',
      manifestId: 'manifest-1',
      lifecycle: 'active',
      namespace: 'ticket25_fixture',
      value: 'T25-SHCS-M3-10',
      configurationId: 'cfg-m3-10',
      configurationRevision: '1',
    }],
    withdrawals: [],
  };
}

function request(rawInput = COMPLETE_RAW) {
  return {
    schemaVersion: 'ticket25/request-v1',
    rawInput,
    identifier: null,
    manifestId: 'manifest-1',
  };
}

function replaceFact(rawInput, key, value) {
  return rawInput
    .split('; ')
    .map(segment => segment.startsWith(`${key}=`) ? `${key}=${value}` : segment)
    .join('; ');
}

function removeFact(rawInput, key) {
  return rawInput
    .split('; ')
    .filter(segment => !segment.startsWith(`${key}=`))
    .join('; ');
}

export const FIXTURE_NAMES = Object.freeze([
  'candidate',
  'broad',
  'partial',
  'conflict',
  'external-hex',
  'pan-head',
  'wrong-unit',
  'wrong-thread',
  'identifier-zero',
  'identifier-many',
  'unavailable',
  'no-manifest',
  'unknown-lifecycle',
  'corrected',
  'superseded',
  'withdrawn',
  'rollback',
  'private-field',
]);

export function makeFixture(name) {
  const catalog = activeCatalog();
  const suppliedRequest = request();
  let delayMs = name === 'partial' ? 120 : 20;

  switch (name) {
    case 'candidate':
      break;
    case 'broad':
      suppliedRequest.rawInput = 'family=socket_head_cap_screw';
      break;
    case 'partial':
      suppliedRequest.rawInput = removeFact(COMPLETE_RAW, 'material');
      break;
    case 'conflict':
      suppliedRequest.rawInput = `${COMPLETE_RAW}; direction=left_hand`;
      break;
    case 'external-hex':
      suppliedRequest.rawInput = replaceFact(COMPLETE_RAW, 'drive', 'external_hex');
      break;
    case 'pan-head':
      suppliedRequest.rawInput = replaceFact(COMPLETE_RAW, 'head_profile', 'pan');
      break;
    case 'wrong-unit':
      suppliedRequest.rawInput = replaceFact(COMPLETE_RAW, 'thread', 'M3x0.5 in');
      break;
    case 'wrong-thread':
      suppliedRequest.rawInput = replaceFact(COMPLETE_RAW, 'thread', 'M3x0.7 mm');
      break;
    case 'identifier-zero':
      suppliedRequest.identifier = { namespace: 'ticket25_fixture', value: 'UNKNOWN' };
      break;
    case 'identifier-many':
      suppliedRequest.identifier = { namespace: 'ticket25_fixture', value: 'T25-SHCS-M3-10' };
      catalog.mappings.push({ ...structuredClone(catalog.mappings[0]), id: 'map-ticket25-collision' });
      break;
    case 'unavailable':
      catalog.manifests[0].lifecycle = 'unavailable';
      break;
    case 'no-manifest':
      catalog.activeManifestId = null;
      break;
    case 'unknown-lifecycle':
      catalog.manifests[0].lifecycle = 'ACTIVE';
      break;
    case 'corrected':
      catalog.configurations[0].lifecycle = 'corrected';
      break;
    case 'superseded':
      catalog.configurations[0].lifecycle = 'superseded';
      break;
    case 'withdrawn':
      catalog.withdrawals.push({
        targetType: 'configuration',
        targetId: 'cfg-m3-10',
        reasonCode: 'fixture-withdrawal',
      });
      break;
    case 'rollback':
      catalog.manifests[0].lifecycle = 'rollback_active';
      break;
    case 'private-field':
      catalog.configurations[0].sourceSku = 'PRIVATE-BROWSER-SENTINEL-9371';
      break;
    default:
      throw new Error(`Unknown fixture: ${name}`);
  }

  return { request: suppliedRequest, catalog, delayMs };
}
