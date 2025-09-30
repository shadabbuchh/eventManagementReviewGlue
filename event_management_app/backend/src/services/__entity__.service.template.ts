// ⚠️  TEMPLATE FILE - DO NOT MODIFY OR DELETE ⚠️
// Copy this file to create new services (e.g., user.service.ts)
//
// TEMPLATE  –  Service factory for <Entity>
// After scaffolding:
//   1. Copy  →  src/services/user.service.ts
//   2. Replace tokens  (__entity__ → user, etc.)
//   3. Set a meaningful entityName and override formatForResponse to strip sensitive fields

import type { FastifyInstance } from 'fastify';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { BaseService } from './base.service';
import { __Entity__Repository } from '../repositories/__entity__.repo.template';
import type * as schema from '../db/schema';

export class __Entity__Service extends BaseService<
  schema.__Entity__,
  schema.New__Entity__,
  Partial<schema.__Entity__>
> {
  protected entityName = '__Entity__';

  constructor(private readonly repository: __Entity__Repository) {
    super();
  }

  list() {
    return this.repository.findAll();
  }

  async get(id: string) {
    const found = await this.repository.findById(id);
    this.assertExists(found);
    return this.formatForResponse(found);
  }

  async create(data: schema.New__Entity__) {
    await this.validateCreate(data);
    const created = await this.repository.create(data);
    return this.formatForResponse(created);
  }

  async update(id: string, changes: Partial<schema.__Entity__>) {
    await this.validateUpdate(id, changes);
    const updated = await this.repository.update(id, changes);
    this.assertExists(updated);
    return this.formatForResponse(updated);
  }

  async remove(id: string) {
    await this.validateDelete(id);
    return this.repository.delete(id);
  }

  // Example: override to remove sensitive fields or normalize response shape
  protected override formatForResponse(
    entity: schema.__Entity__
  ): Partial<schema.__Entity__> {
    // Replace with actual redactions per entity, e.g., delete (entity as any).password;
    return entity;
  }
}

// Optional factory for Fastify wiring; prefer using the class directly
export function make__Entity__Service(app: FastifyInstance) {
  const repo =
    app.repositories.__entity__ ??
    new __Entity__Repository(app.db as NodePgDatabase<typeof schema>);
  return new __Entity__Service(repo);
}

export type __Entity__ServiceType = InstanceType<typeof __Entity__Service>;
