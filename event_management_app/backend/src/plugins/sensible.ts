import type { FastifyInstance } from 'fastify';
import sensible from '@fastify/sensible';

export const sensiblePlugin = (app: FastifyInstance) => ({
  name: 'sensible',
  async register() {
    await app.register(sensible);
  },
});
