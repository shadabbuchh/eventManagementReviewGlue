/* ---------------------------------------------------------------------------
  plugins/index.ts
  ---------------------------------------------------------------------------
  • Builds and returns plugins following the same pattern as repositories/services
  • Plugin factories take FastifyInstance and return plugin objects with methods
  • During "template phase" it compiles because the ambient declarations in
    template‑placeholders.d.ts give every token the type `any`.
  • After you add real plugins:
      1. Import the plugin factory here
      2. Add it to the buildPlugins function
--------------------------------------------------------------------------- */

import type { FastifyInstance } from 'fastify';
import { dbPlugin } from './db';
import { sensiblePlugin } from './sensible';
import { openapiGluePlugin } from './openapi-glue';

/* 1️⃣  Import plugin factories here. */
// import { customPlugin } from './custom.plugin';
// import { cachePlugin } from './cache.plugin';

/* 2️⃣  Build and return an object where plugin factories are instantiated. */
export const buildPlugins = (app: FastifyInstance) => ({
  db: dbPlugin(app),
  sensible: sensiblePlugin(app),
  openapiGlue: openapiGluePlugin(app),
  // custom: customPlugin(app),
  // cache: cachePlugin(app),
});

/* 3️⃣  Helper type — used in src/types/fastify.d.ts for `app.plugins`. */
export type Plugins = ReturnType<typeof buildPlugins>;
