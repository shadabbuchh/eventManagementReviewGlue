import build from '@/app'; // Fastify boot function

// Build + ready a Fastify instance for tests.
// Each test file can call this to get its own isolated server.
export async function getApp() {
  const app = await build();
  await app.ready();
  return app;
}
