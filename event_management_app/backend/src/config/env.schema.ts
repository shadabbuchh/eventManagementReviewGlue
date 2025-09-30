export const envSchema = {
  type: 'object',
  properties: {
    APP_DATABASE_URL: { type: 'string' },
    NODE_ENV: { type: 'string', enum: ['development', 'production', 'test'] },
  },
  required: ['APP_DATABASE_URL'],
} as const;
