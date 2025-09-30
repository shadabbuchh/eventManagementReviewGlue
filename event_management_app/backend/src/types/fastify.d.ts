import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { envSchema } from '../config/env.schema';
import type * as schema from '../db/schema';
import type { Plugins } from '../plugins/index';
import type { Repositories } from '../repositories/index';
import type { Services } from '../services/index';

// Extract the config type from the schema
type EnvConfig = {
  [K in keyof typeof envSchema.properties]: string;
};

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvConfig;
    db: NodePgDatabase<typeof schema>;
    plugins: Plugins;
    repositories: Repositories;
    services: Services;
  }
}
