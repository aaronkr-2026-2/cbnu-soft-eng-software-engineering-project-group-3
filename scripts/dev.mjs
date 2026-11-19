import { spawn } from 'node:child_process';

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
let stopping = false;

const gateway = spawn(process.execPath, ['backend/server/index.mjs'], {
  stdio: 'inherit',
});
const client = spawn(command, ['vite'], { stdio: 'inherit' });

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  gateway.kill();
  client.kill();
  process.exit(exitCode);
}

process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());

gateway.on('exit', (code) => {
  if (!stopping) {
    console.error(
      `Translation gateway stopped unexpectedly (${code ?? 'unknown'}).`,
    );
    stop(1);
  }
});
client.on('exit', (code) => {
  if (!stopping) stop(code ?? 1);
});
