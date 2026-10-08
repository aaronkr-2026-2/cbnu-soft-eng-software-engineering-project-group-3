import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { parseSrt } from '../src/core/srt/srt';

const fixture =
  '7\n00:00:01,000 --> 00:00:05,000\n<i>Hello.</i>\n\n12\n00:00:06,000 --> 00:00:09,000\n- Hello. - Goodbye.\n';
const endpoint = '**/api/translation';

async function configure(
  page: Page,
  text = fixture,
  engine: 'nmt' | 'tllm' = 'nmt',
) {
  await page.goto('./');
  if (engine === 'tllm') {
    await page.locator('#engine').click();
    await page
      .getByTitle('TLLM · higher-quality translation model', { exact: true })
      .click();
  }
  await page.locator('input[type=file]').setInputFiles({
    name: 'sample.srt',
    mimeType: 'application/x-subrip',
    buffer: Buffer.from(text),
  });
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
  await page.goto('./');
  await page.getByRole('button', { name: 'About this translator' }).click();
  await expect(
    page.getByRole('dialog', { name: 'What this translator does' }),
  ).toBeVisible();
  await expect(
    page.getByText('Upload an English UTF-8 SRT file', { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Cancel', exact: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await configure(page);
  await expect(
    page.getByRole('button', { name: 'Start translation', exact: true }),
  ).toHaveCSS('height', '40px');
  await expect(page.locator('.sidebar-controls')).toHaveCSS('row-gap', '24px');
  await expect(page.locator('.sidebar-controls')).toHaveCSS(
    'overflow-y',
    'auto',
  );
  await expect(page.locator('.sidebar-actions')).toHaveCSS('flex-shrink', '0');
  await expect(page.locator('.sidebar-controls .estimate')).toHaveCount(1);
  await expect(page.locator('.sidebar-actions .estimate')).toHaveCount(0);
  await expect(page.locator('.content-heading')).toHaveCSS(
    'position',
    'sticky',
  );
  await expect(page.locator('.cue-row').first()).toHaveCSS(
    'border-left-width',
    '0px',
  );
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
  await expect(
    page.getByRole('button', { name: 'Translation complete', exact: true }),
  ).toBeDisabled();
  await page.getByRole('switch', { name: 'Dark theme' }).click();
  await expect(page.getByRole('switch', { name: 'Dark theme' })).toBeChecked();
  await page
    .locator('.sidebar-controls')
    .evaluate((element) => (element.scrollTop = 0));
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
  await page.locator('input[type=file]').setInputFiles({
    name: 'bad.srt',
    mimeType: 'application/x-subrip',
    buffer: Buffer.from('malformed'),
  });
  await expect(page.getByText(/Block 1: expected/)).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Start translation', exact: true }),
  ).toBeDisabled();
});

test('language failure feedback stays readable and contained', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.unroute('**/api/**');
  await page.route('**/api/translation/languages**', async (route) => {
    await route.fulfill({
      status: 503,
      json: { error: { category: 'gateway_disabled' } },
    });
  });
  await page.goto('./');

  const alert = page.locator('.language-load-error');
  const retry = page.getByRole('button', {
    name: 'Retry loading languages',
    exact: true,
  });
  await expect(alert).toBeVisible();
  await expect(retry).toBeVisible();

  const geometry = await alert.evaluate((element) => {
    const section = element.querySelector('.ant-alert-section');
    const actions = element.querySelector('.ant-alert-actions');
    const button = actions?.querySelector('button');
    if (!section || !actions || !button)
      throw new Error('Expected the rendered Ant Design alert structure.');
    const alertBox = element.getBoundingClientRect();
    const sectionBox = section.getBoundingClientRect();
    const actionsBox = actions.getBoundingClientRect();
    const buttonBox = button.getBoundingClientRect();
    return {
      alertBox: {
        left: alertBox.left,
        right: alertBox.right,
      },
      sectionWidth: sectionBox.width,
      sectionBottom: sectionBox.bottom,
      actionsTop: actionsBox.top,
      buttonLeft: buttonBox.left,
      buttonRight: buttonBox.right,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    };
  });

  expect(geometry.sectionWidth).toBeGreaterThan(100);
  expect(geometry.actionsTop).toBeGreaterThanOrEqual(geometry.sectionBottom);
  expect(geometry.buttonLeft).toBeGreaterThanOrEqual(geometry.alertBox.left);
  expect(geometry.buttonRight).toBeLessThanOrEqual(geometry.alertBox.right);
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
  await expect(page.locator('.sidebar')).toHaveCSS('min-width', '240px');

  const assertMajorRegionsFit = async () => {
    const overflows = await page
      .locator(
        '.app-header, .sidebar, .sidebar-controls, .sidebar-actions, .content, .language-load-error',
      )
      .evaluateAll((elements) =>
        elements
          .filter((element) => element.scrollWidth > element.clientWidth + 1)
          .map((element) => ({
            className: element.className,
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
          })),
      );
    expect(overflows).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
  };

  await assertMajorRegionsFit();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.workspace')).toHaveCSS(
    'flex-direction',
    'column',
  );
  await expect(page.locator('.sidebar')).toHaveCSS('width', '390px');
  await assertMajorRegionsFit();
});

test('long uploaded filenames stay inside the upload card', async ({
  page,
}) => {
  const filename =
    'The.Devil.Wears.Prada.2.2026.BLURAY.1080p.BluRay.x264.AAC5.1-YTS.GG-YTS.BZ-English-CROP.srt';
  await page.goto('./');
  await page.locator('input[type=file]').setInputFiles({
    name: filename,
    mimeType: 'application/x-subrip',
    buffer: Buffer.from(fixture),
  });
  const upload = page.locator('.ant-upload-drag');
  const displayedName = page.locator('.upload-filename');
  await expect(displayedName).toHaveText(filename);
  const uploadBox = await upload.boundingBox();
  const nameBox = await displayedName.boundingBox();
  expect(uploadBox).not.toBeNull();
  expect(nameBox).not.toBeNull();
  expect(nameBox!.x).toBeGreaterThanOrEqual(uploadBox!.x);
  expect(nameBox!.x + nameBox!.width).toBeLessThanOrEqual(
    uploadBox!.x + uploadBox!.width,
  );
  await displayedName.hover();
  await expect(page.getByRole('tooltip')).toHaveText(filename);
});

test('uses the OS theme initially and confirms before resetting a loaded workspace', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await configure(page);
  await expect(page.getByRole('switch', { name: 'Dark theme' })).toBeChecked();
  page.once('dialog', (dialog) => dialog.accept());
  await page
    .getByRole('button', { name: 'Reset translator and return home' })
    .click();
  await expect(page.getByText('Bring your subtitles.')).toBeVisible();
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
  await expect(page.locator('.job-summary dd').last()).toHaveText('2');
  await page.getByRole('button', { name: 'Edit cue 7', exact: true }).click();
  await page
    .getByLabel('Edit translation 7', { exact: true })
    .fill('Keep this edit.');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page
    .getByRole('button', { name: 'Retry translation', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Download translated SRT' }),
  ).toBeEnabled();
  await expect(
    page.getByText('Keep this edit.', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('.job-summary dd').last()).toHaveText('3');
  expect(calls).toBe(3);
});

test('shows a rate-limit cooldown and retries the same batch', async ({
  page,
}) => {
  let calls = 0;
  await page.route(endpoint, async (route) => {
    const { q } = route.request().postDataJSON() as { q: string[] };
    calls++;
    if (calls === 1) {
      await route.fulfill({
        status: 403,
        json: {
          error: { category: 'rate_limited', retryAfterSeconds: 0.01 },
        },
      });
      return;
    }
    await route.fulfill({
      json: {
        data: { translations: q.map((text) => ({ translatedText: text })) },
      },
    });
  });
  await configure(page);
  await page
    .getByRole('button', { name: 'Start translation', exact: true })
    .click();
  await expect(page.getByText('cooldown', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Google quota cooldown', { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Download translated SRT' }),
  ).toBeEnabled();
  expect(calls).toBe(2);
});

test('keeps errors for two failed groups while showing a valid sibling', async ({
  page,
}) => {
  const source =
    '1\n00:00:01,000 --> 00:00:03,000\nOne\n\n2\n00:00:03,000 --> 00:00:06,000\ncontinues\n\n3\n00:00:07,000 --> 00:00:09,000\nTwo\n\n4\n00:00:09,000 --> 00:00:12,000\ncontinues\n\n5\n00:00:13,000 --> 00:00:16,000\nSeparate.\n';
  await page.route(endpoint, async (route) => {
    const { q } = route.request().postDataJSON() as { q: string[] };
    await route.fulfill({
      json: {
        data: {
          translations: q.map((_, index) => ({
            translatedText: index === 2 ? 'Saved.' : index ? 'No.' : 'Yes.',
          })),
        },
      },
    });
  });
  await configure(page, source);
  await page
    .getByRole('button', { name: 'Start translation', exact: true })
    .click();
  await expect(
    page.getByText(
      'The joined translation is too short to fill every original cue.',
      {
        exact: false,
      },
    ),
  ).toHaveCount(4);
  await expect(page.getByText('Saved.', { exact: true })).toBeVisible();
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
    await waiting;
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

for (const engine of ['nmt', 'tllm'] as const) {
  test(`${engine} sends joined speech and downloads all fixed cue content`, async ({
    page,
  }) => {
    const joined =
      'I left the lantern burning because I thought we would find our way back before dark.';
    const source =
      '41\n00:02:43,300 --> 00:02:46,100\nI left the lantern burning\n\n42\n00:02:46,300 --> 00:02:48,100\nbecause I thought\n\n43\n00:02:48,300 --> 00:02:52,000\nwe would find our way back before dark.\n';
    const payloads: Array<{
      q: string[];
      model: string;
      source: string;
      target: string;
      format: string;
    }> = [];
    await page.route(endpoint, async (route) => {
      const body = route.request().postDataJSON() as {
        q: string[];
        model: string;
        source: string;
        target: string;
        format: string;
      };
      payloads.push(body);
      await route.fulfill({
        json: {
          data: {
            translations: body.q.map((text) => ({ translatedText: text })),
          },
        },
      });
    });
    await configure(page, source, engine);
    await page
      .getByRole('button', { name: 'Start translation', exact: true })
      .click();
    await expect(
      page.getByRole('button', { name: 'Download translated SRT' }),
    ).toBeEnabled();
    expect(payloads).toEqual([
      {
        q: [joined],
        model: engine,
        source: 'en',
        target: 'mn',
        format: 'html',
      },
    ]);
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download translated SRT' }).click();
    const download = await downloadEvent;
    const output = await readFile((await download.path())!, 'utf8');
    expect(output).toContain('41\n00:02:43,300 --> 00:02:46,100');
    expect(output).toContain('42\n00:02:46,300 --> 00:02:48,100');
    expect(output).toContain('43\n00:02:48,300 --> 00:02:52,000');
    const translatedText = parseSrt(output)
      .map((cue) => cue.text)
      .join('');
    expect(translatedText.replace(/\s+/g, '')).toBe(joined.replace(/\s+/g, ''));
  });
}

test('a long subtitle file keeps only visible cue rows mounted', async ({
  page,
}) => {
  const cues = Array.from({ length: 2500 }, (_, index) => {
    const cueNumber = index + 1;
    return `${cueNumber}\n00:00:${String(index % 60).padStart(2, '0')},000 --> 00:01:${String(index % 60).padStart(2, '0')},000\nCue ${cueNumber}.`;
  }).join('\n\n');
  await page.goto('./');
  await page.locator('input[type=file]').setInputFiles({
    name: 'long.srt',
    mimeType: 'application/x-subrip',
    buffer: Buffer.from(cues),
  });
  await expect(page.getByText('2,500 cues loaded')).toBeVisible();
  expect(await page.locator('.cue-row').count()).toBeLessThan(40);
  await page.locator('.content').evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(
    page.getByRole('region', { name: 'Cue 2500', exact: true }),
  ).toBeVisible();
  expect(await page.locator('.cue-row').count()).toBeLessThan(40);
});

test('mobile keeps the virtual preview in its own scroll container', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const cues = Array.from({ length: 2500 }, (_, index) => {
    const cueNumber = index + 1;
    return `${cueNumber}\n00:00:${String(index % 60).padStart(2, '0')},000 --> 00:01:${String(index % 60).padStart(2, '0')},000\nCue ${cueNumber}.`;
  }).join('\n\n');
  await page.goto('./');
  await page.locator('input[type=file]').setInputFiles({
    name: 'long-mobile.srt',
    mimeType: 'application/x-subrip',
    buffer: Buffer.from(cues),
  });
  await expect(page.locator('.content')).toHaveCSS('overflow-y', 'auto');
  expect(await page.locator('.cue-row').count()).toBeLessThan(40);
});
