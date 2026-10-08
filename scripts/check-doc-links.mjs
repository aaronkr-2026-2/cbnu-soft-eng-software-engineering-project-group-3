import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

async function markdownFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory())
      files.push(...(await markdownFiles(join(directory, entry.name))));
    else if (entry.name.endsWith('.md'))
      files.push(join(directory, entry.name));
  }
  return files;
}

const files = [
  'README.md',
  'AGENTS.md',
  'PROJECT_STATE.md',
  'AI_LOG.md',
  'BUILD_LOG.md',
  ...(await markdownFiles('docs')),
];
const missing = [];
for (const file of files) {
  const content = await readFile(file, 'utf8');
  for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const href = match[1].split('#')[0];
    if (!href || /^(?:https?:|mailto:)/.test(href)) continue;
    const target = resolve(dirname(file), decodeURIComponent(href));
    try {
      await stat(target);
    } catch {
      missing.push(`${file}: ${match[1]}`);
    }
  }
}
if (missing.length) {
  console.error(`Missing local documentation targets:\n${missing.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(
    `PASS: local Markdown links resolve across ${files.length} files.`,
  );
}
