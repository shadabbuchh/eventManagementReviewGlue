// Get the current environment from NODE_ENV
// @returns The current environment (development, production, test)
export function getEnvironment(): string {
  return process.env.NODE_ENV || 'development';
}

// Check if the current environment is production
// @returns True if the environment is production
export function isProductionEnvironment(): boolean {
  return getEnvironment() === 'production';
}

// Check if the current environment is development
// @returns True if the environment is development
export function isDevelopmentEnvironment(): boolean {
  return getEnvironment() === 'development';
}

// Check if the current environment is test
// @returns True if the environment is test
export function isTestEnvironment(): boolean {
  return getEnvironment() === 'test';
}
