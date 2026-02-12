import { spawn } from 'node:child_process';
import process from 'node:process';

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const useShell = process.platform === 'win32';

const spawnNpm = (args) =>
  spawn(npmCmd, args, {
    stdio: 'inherit',
    shell: useShell,
  });

const api = spawnNpm(['run', 'dev:api']);
const web = spawnNpm(['run', 'dev']);

let shuttingDown = false;

const shutdown = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of [api, web]) {
    if (!child.killed) {
      child.kill();
    }
  }

  setTimeout(() => {
    for (const child of [api, web]) {
      if (!child.killed) {
        child.kill('SIGKILL');
      }
    }
    process.exit(code);
  }, 400);
};

for (const child of [api, web]) {
  child.on('error', (error) => {
    console.error('[dev-all] process start failed:', error);
    shutdown(1);
  });

  child.on('exit', (code) => {
    if (shuttingDown) return;
    shutdown(code ?? 1);
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
