/* TEMPLATE  –  Plugin factory for <Plugin>
  After scaffolding:
    1. Copy  →  src/plugins/custom.plugin.ts
    2. Replace tokens  (__plugin__ → custom, etc.)
*/

import type { FastifyInstance } from 'fastify';

export const __plugin__Plugin = (app: FastifyInstance) => {
  // Plugin initialization logic here
  const pluginConfig = {
    // Plugin-specific configuration
  };

  // Initialize immediately during construction (like repositories/services)
  app.decorate('__plugin__', {
    // Plugin methods/properties to add to FastifyInstance
    method1: () => 'Hello from __plugin__',
    method2: (data: unknown) => ({ processed: data }),
  });

  // Add hooks if needed
  app.addHook('preHandler', async (_request, _reply) => {
    // Plugin-specific request processing
  });

  return {
    name: '__plugin__',
    config: pluginConfig,

    // Additional plugin methods
    getConfig: () => pluginConfig,
    isEnabled: () => true,

    // Note: Use app.addHook('onClose', ...) above for cleanup instead of close() method
  };
};

export type __plugin__Plugin = ReturnType<typeof __plugin__Plugin>;
