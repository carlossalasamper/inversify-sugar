import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/unit/**/*.spec.ts"],
  setupFiles: ["./tests/unit/jest.setup.ts"],
  collectCoverage: true,
  coverageDirectory: "./coverage",
  collectCoverageFrom: [
    "./src/decorators/*.ts",
    "!./src/decorators/index.ts",
    "./src/utils/**/*.ts",
    "!./src/utils/index.ts",
    "!./src/types/**",
  ],
  coverageReporters: ["text", "json-summary"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        compiler: "ttypescript",
      },
    ],
  },
};

export default jestConfig;
