import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@shared/icons/(.*)$':
      '<rootDir>/../shared/icons/react/m3/$1',
    '^@shared/(.*)$': '<rootDir>/../shared/$1',
    '\\.module\\.(css|scss)$':
      'identity-obj-proxy',
    '\\.(css|scss)$': '<rootDir>/src/__mocks__/styleMock.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts',
  ],
};

export default config;
