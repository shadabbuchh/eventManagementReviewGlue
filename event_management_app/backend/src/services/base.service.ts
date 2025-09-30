import type { Repositories } from '../repositories';
import { log } from '../utils/logger';
/**
 * Base Service Class
 *
 * Provides a typed foundation for all services with common business logic patterns.
 * Services should contain business logic and call repositories for data access.
 * This base class ensures consistent error handling and patterns.
 */

export abstract class BaseService<
  TEntity extends { id?: string | number },
  TCreateDTO,
  TUpdateDTO,
> {
  protected abstract entityName: string;
  protected readonly repositories!: Repositories;

  constructor(repositories?: Repositories) {
    if (repositories) {
      this.repositories = repositories;
    }
  }

  /**
   * Validate entity exists or throw error
   */
  protected assertExists(
    entity: TEntity | undefined | null
  ): asserts entity is TEntity {
    if (!entity) {
      throw new Error(`${this.entityName} not found`);
    }
  }

  /**
   * Validate multiple entities exist
   */
  protected assertAllExist(
    entities: (TEntity | undefined | null)[]
  ): asserts entities is TEntity[] {
    const missing = entities.filter(e => !e);
    if (missing.length > 0) {
      throw new Error(`${missing.length} ${this.entityName}(s) not found`);
    }
  }

  /**
   * Common validation for create operations
   */
  protected async validateCreate(_data: TCreateDTO): Promise<void> {
    // Override in subclasses for specific validation
  }

  /**
   * Common validation for update operations
   */
  protected async validateUpdate(
    _id: string | number,
    _data: TUpdateDTO
  ): Promise<void> {
    // Override in subclasses for specific validation
  }

  /**
   * Common validation for delete operations
   */
  protected async validateDelete(_id: string | number): Promise<void> {
    // Override in subclasses for specific validation
  }

  /**
   * Format entity for API response (remove sensitive fields, etc.)
   */
  protected formatForResponse(entity: TEntity): Partial<TEntity> {
    // Override in subclasses to customize response format
    return entity;
  }

  /**
   * Log service operations (for debugging/auditing)
   */
  protected log(operation: string, details?: Record<string, unknown>): void {
    const bindings = {
      service: `${this.entityName}Service`,
      operation,
      ...(details ?? {}),
    };
    log.info(bindings);
  }
}
