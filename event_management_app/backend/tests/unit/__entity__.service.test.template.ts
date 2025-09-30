import { describe, it, expect, vi } from 'vitest';
import { make__Entity__Service } from '../../src/services/__entity__.service.template';

// Mock interface for testing
interface MockApp {
  repositories: {
    __entity__: {
      findAll: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      findById: ReturnType<typeof vi.fn>;
    };
  };
  log: {
    child: () => Record<string, unknown>;
  };
}

// Fake repo so we don't touch the real DB
const fakeRepo = {
  findAll: vi.fn().mockResolvedValue([{ id: '1', name: 'Alice' }]),
  create: vi.fn(),
  findById: vi.fn(),
};

// // very dumb Drizzle stub — just enough for list()
// const dbStub = {
//   select: () => ({
//     from: () => Promise.resolve([{ id: '1', name: 'Jane Doe' }]),
//   }),
// };

describe('__Entity__Service (unit)', () => {
  const appStub: MockApp = {
    repositories: { __entity__: fakeRepo },
    log: { child: () => ({}) },
  };
  const svc = make__Entity__Service(
    appStub as unknown as Parameters<typeof make__Entity__Service>[0]
  );

  it('lists users without hitting the DB', async () => {
    const users = await svc.list();
    expect(users).toHaveLength(1);
    expect(fakeRepo.findAll).toHaveBeenCalled();
  });
});
