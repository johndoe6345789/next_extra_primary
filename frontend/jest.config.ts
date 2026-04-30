import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // tsconfig path aliases: @shared/m3 resolves
    // to shared/components/m3, not shared/m3.
    // Mirror those rules here so component tests
    // can import from `@shared/m3` directly.
    '^@shared/icons/(.*)$':
      '<rootDir>/../shared/icons/react/m3/$1',
    '^@shared/m3$':
      '<rootDir>/../shared/components/m3/index.ts',
    '^@shared/m3/(.*)$':
      '<rootDir>/../shared/components/m3/$1',
    '^@shared/ui$':
      '<rootDir>/../shared/components/ui/index.ts',
    '^@shared/ui/(.*)$':
      '<rootDir>/../shared/components/ui/$1',
    '^@shared/components$':
      '<rootDir>/../shared/components/index.tsx',
    '^@shared/components/(.*)$':
      '<rootDir>/../shared/components/$1',
    '^@shared/(.*)$': '<rootDir>/../shared/$1',
    // Both regular and *.module.scss imports are
    // stubbed with the same empty-object mock.
    // identity-obj-proxy isn't installed and we
    // never assert on generated class names in
    // tests — we drive components by data-testid.
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
