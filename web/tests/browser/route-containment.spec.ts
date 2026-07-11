import { expect, test } from '@playwright/test';

const base = '/partsource';

test('known public routes render on direct load and refresh', async ({ page }) => {
  const routes: Array<[string, RegExp]> = [
    ['/', /Part Finder/],
    ['/parts/DIN912-M3X10', /DIN912-M3X10/],
    ['/reference', /Engineering Reference/],
    ['/reference/din-912-socket-head-cap-screw-dimensions', /DIN 912/],
    ['/embed/DIN912-M3X10', /DIN912-M3X10/],
  ];

  for (const [route, text] of routes) {
    await page.goto(`${base}${route}`);
    await expect(page.getByText(text).first()).toBeVisible();
    await page.reload();
    await expect(page.getByText(text).first()).toBeVisible();
  }
});

test('unknown route renders an explicit Not Found state', async ({ page }) => {
  await page.goto(`${base}/does-not-exist`);
  await expect(page.getByRole('heading', { name: 'Not Found' })).toBeVisible();

  await page.goto(`${base}/reference/does-not-exist`);
  await expect(page.getByRole('heading', { name: 'Not Found' })).toBeVisible();
});

test('canonical and robots metadata follow SPA navigation', async ({ page }) => {
  await page.goto(`${base}/`);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://jrambackup1-lgtm.github.io/partsource/',
  );

  await page.getByRole('link', { name: 'Reference', exact: true }).click();
  await expect(page).toHaveURL(`${base}/reference`);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://jrambackup1-lgtm.github.io/partsource/reference',
  );

  await page.goto(`${base}/parts/DIN912-M3X10`);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://jrambackup1-lgtm.github.io/partsource/parts/DIN912-M3X10',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');

  const schema = await page.locator('#json-ld-product').textContent();
  expect(schema).not.toMatch(/AggregateOffer|"offers"|lowPrice|highPrice|offerCount/);
});
