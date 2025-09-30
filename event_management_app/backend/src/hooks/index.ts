import type { FastifyInstance } from 'fastify';
import requestTiming from './requestTiming.hook';
import startup from './startup.hook';
// import securityHeaders from './securityHeaders.hook.ts'  // add more hooks here

// Call this once in app.ts to register every global hook.

export default async function registerHooks(app: FastifyInstance) {
  await app.register(startup);
  await app.register(requestTiming);
  // await app.register(securityHeaders)
}
