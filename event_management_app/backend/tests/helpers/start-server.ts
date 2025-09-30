import build from '@/app';

// Spin up the Fastify server on a random free port.
// Returns { app, url, close }
export async function startServer() {
  const app = await build();
  await app.listen({ port: 0, host: '127.0.0.1' }); // 0 → random port

  const address = app.server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  const url = `http://127.0.0.1:${port}`;

  // Convenience closure to stop the server
  const close = async () => {
    await app.close();
  };

  return { app, url, close };
}
