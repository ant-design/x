import { execSync } from 'child_process';

try {
  const isPnpm = process.env.npm_execpath?.includes('pnpm');

  if (isPnpm) {
    execSync('pnpm run prestart && pnpm start', { stdio: 'inherit' });
  } else {
    execSync('npm start', { stdio: 'inherit' });
  }
} catch (error) {
  process.exit(1);
}
