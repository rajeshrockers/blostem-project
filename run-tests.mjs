import { startVitest } from 'vitest/node';

const vitest = await startVitest('run', ['src/components/auth/ProtectedRoute.test.tsx'], {
  reporter: ['verbose'],
});

process.exit(vitest?.state?.getCountOfFailedTests() ? 1 : 0);
