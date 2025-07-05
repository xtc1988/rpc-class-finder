module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.(ts < /dev/null | tsx)", "**/?(*.)+(spec|test).(ts|tsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/renderer/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "\!src/**/*.d.ts",
    "\!src/main/**/*",
    "\!src/test/**/*",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
