// ---------------------------------------------------------------------------
// repositories/index.ts
// ---------------------------------------------------------------------------
// • During "template phase" it compiles because the ambient declarations in
//   template‑placeholders.d.ts give every token the type `any`.
// • After you scaffold a real entity (user, product, …):
//     1. Copy the repo template → user.repo.ts
//     2. Replace __entity__ → user  etc.
//     3. Append `user: userRepo(app.db),` below.
// ---------------------------------------------------------------------------

import type { FastifyInstance } from 'fastify';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '../db/schema';

// 1️⃣  Import repository factories here.
// The .template.ts suffix keeps this compiling until you rename the file.
import { __entity__Repo } from './__entity__.repo.template'; // 🡄 token import
import { eventRepo } from './events.repo';
import { notificationRepo } from './notifications.repo';
// import { userRepo }    from './user.repo.ts'                 // 🡄 real import later
// import { orderRepo }   from './order.repo.ts'

// 2️⃣  Build and return an object where every repo already has app.db injected.
export const buildRepositories = (app: FastifyInstance) => ({
  __entity__: __entity__Repo(app.db as NodePgDatabase<typeof schema>), // 🡄 token entry
  event: eventRepo(app.db as NodePgDatabase<typeof schema>),
  notification: notificationRepo(app.db as NodePgDatabase<typeof schema>),
  // user:  userRepo(app.db),                  // 🡄 real entry later
  // order: orderRepo(app.db)
});

// 3️⃣  Helper type — used in src/types/fastify.d.ts for `app.repositories`.
export type Repositories = ReturnType<typeof buildRepositories>;
