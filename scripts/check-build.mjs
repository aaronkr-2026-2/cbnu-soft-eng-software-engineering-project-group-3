import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await inspect(path);
      continue;
    }
    if (
      entry.name.startsWith('.env') ||
      entry.name.endsWith('.map') ||
      entry.name.includes('beta-3')
    )
      throw new Error(
        'Unexpected private, historical, or source-map artifact.',
      );
    if (!/\.(js|html|css)$/.test(entry.name)) continue;
    const content = await readFile(path, 'utf8');
    if (
      /translate_a\/single|client=gtx|GOOGLE_TRANSLATE_API_KEY|AIza[\w-]{30,}/.test(
        content,
      )
    )
      throw new Error(
        'Build contains a forbidden endpoint or credential/configuration marker.',
      );
  }
}
await inspect('dist');
console.log(
  'PASS: build has no legacy endpoint, environment-key marker, key-shaped literal, source maps, or historical HTML.',
);
