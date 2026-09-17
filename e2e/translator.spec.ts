import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const fixture =
  '7\n00:00:01,000 --> 00:00:05,000\n<i>Hello.</i>\n\n12\n00:00:06,000 --> 00:00:09,000\n- Hello. - Goodbye.\n';
const endpoint = '**/api/translation';

async function configure(page: Page, text = fixture) {
  await page.goto('./');
  await page.getByLabel('Subtitle file', { exact: true }).setInputFiles({
    name: 'sample.srt',
    mimeType: 'application/x-subrip',
    buffer: Buffer.from(text),
  });
  await page
    .getByRole('button', { name: 'Check service', exact: true })
    .click();
  await expect(page.getByText('Translation service ready')).toBeVisible();
  await page.locator('#language').click();
  await page.getByTitle('Mongolian (mn)', { exact: true }).click();
  await page.locator('#profile').click();
  await page
    .getByTitle('Adult · 20 characters/second', { exact: true })
    .click();
}

test.beforeEach(async ({ page }) => {
  // All provider calls are local fixtures. Never load .env or contact a paid API.
  await page.route('**/api/**', async (route) => {
    if (route.request().url().includes('/api/translation/languages')) {
      await route.fulfill({
        json: {
          data: {
            languages: [
              { language: 'en', name: 'English' },
              { language: 'es', name: 'Spanish' },
              { language: 'mn', name: 'Mongolian' },
            ],
          },
        },
      });
    } else if (route.request().url().endsWith('/api/translation')) {
      const body = route.request().postDataJSON() as { q: string[] };
      await route.fulfill({
        json: {
          data: {
            translations: body.q.map((text) => ({
              translatedText: text
                .replaceAll('Hello.', 'Сайн уу.')
                .replaceAll('Goodbye.', 'Баяртай.'),
            })),
          },
        },
      });
    } else await route.abort();
  });
});

test('upload → official gateway → edit → download and theme lifecycle', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await configure(page);
  await expect(
    page.getByRole('button', { name: 'Start translation', exact: true }),
  ).toHaveCSS('height', '40px');
  await expect(
    page.getByRole('button', { name: 'Start translation', exact: true }),
  ).toBeEnabled();
  await page
    .getByRole('button', { name: 'Start translation', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Download translated SRT' }),
  ).toBeEnabled();
  await page.getByRole('button', { name: 'Edit cue 7', exact: true }).click();
  await page
    .getByLabel('Edit translation 7', { exact: true })
    .fill('<b>Миний засвар.</b>');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download translated SRT' }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('sample.mn.srt');
  const output = await readFile((await download.path())!, 'utf8');
  expect(output).toContain(
    '7\n00:00:01,000 --> 00:00:05,000\n<b>Миний засвар.</b>',
  );
  expect(output).toContain('- Сайн уу.\n- Баяртай.');
  await page.getByRole('switch', { name: 'Dark theme' }).click();
  await expect(page.getByRole('switch', { name: 'Dark theme' })).toBeChecked();
  await page.locator('.sidebar').evaluate((element) => (element.scrollTop = 0));
  await page.screenshot({
    path: 'test-results/translator-dark.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.getByRole('switch', { name: 'Dark theme' }).click();
  await expect(
    page.getByRole('switch', { name: 'Dark theme' }),
  ).not.toBeChecked();
  await page.screenshot({
    path: 'test-results/translator-light.png',
    fullPage: true,
    animations: 'disabled',
  });
  expect(
    await page.evaluate(() => ({
      local: { ...localStorage },
      session: { ...sessionStorage },
    })),
  ).toEqual({ local: {}, session: {} });
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Start translation', exact: true }),
  ).toBeDisabled();
  expect(consoleErrors).toEqual([]);
});

test('invalid input is visible and cannot start a job', async ({ page }) => {
  await page.goto('./');
  await page.getByLabel('Subtitle file', { exact: true }).setInputFiles({
    name: 'bad.srt',
    mimeType: 'application/x-subrip',
    buffer: Buffer.from('malformed'),
  });
  await expect(page.getByText(/Block 1: expected/)).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Start translation', exact: true }),
  ).toBeDisabled();
});

test('partial failure retries only pending cues and preserves edits', async ({
  page,
}) => {
  const large = `7\n00:00:01,000 --> 00:00:05,000\n${'Hello. '.repeat(450)}\n\n12\n00:00:06,000 --> 00:00:09,000\n${'Goodbye. '.repeat(400)}\n`;
  let calls = 0;
  await page.route(endpoint, async (route) => {
    const { q } = route.request().postDataJSON() as { q: string[] };
    if (q[0] === 'Hello.') {
      await route.fulfill({
        json: { data: { translations: [{ translatedText: 'Hola.' }] } },
      });
      return;
    }
    calls++;
    if (calls === 2) {
      await route.fulfill({
        status: 403,
        json: { error: { message: 'fake-browser-test-key' } },
      });
      return;
    }
    await route.fulfill({
      json: {
        data: { translations: q.map(() => ({ translatedText: 'Баяртай.' })) },
      },
    });
  });
  await configure(page, large);
  await page
    .getByRole('button', { name: 'Start translation', exact: true })
    .click();
  await expect(
    page.getByText('Google denied the project gateway request.', {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Download translated SRT' }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Edit cue 7', exact: true }).click();
  await page
    .getByLabel('Edit translation 7', { exact: true })
    .fill('Keep this edit.');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page
    .getByRole('button', { name: 'Translate remaining cues', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Download translated SRT' }),
  ).toBeEnabled();
  await expect(
    page.getByText('Keep this edit.', { exact: true }),
  ).toBeVisible();
  expect(calls).toBe(3);
});

test('cancellation stops a pending request and disables download', async ({
  page,
}) => {
  let release!: () => void;
  const waiting = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(endpoint, async (route) => {
    const { q } = route.request().postDataJSON() as { q: string[] };
    if (q[0] !== 'Hello.') await waiting;
    await route
      .fulfill({
        json: {
          data: { translations: q.map((text) => ({ translatedText: text })) },
        },
      })
      .catch(() => {});
  });
  await configure(page);
  await page
    .getByRole('button', { name: 'Start translation', exact: true })
    .click();
  await expect(
    page.getByText('Keep this tab open and in the foreground', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Cancel translation', exact: true })
    .click();
  await expect(page.getByText('cancelled', { exact: true })).toBeVisible();
  release();
  await expect(
    page.getByRole('button', { name: 'Download translated SRT' }),
  ).toBeDisabled();
});
