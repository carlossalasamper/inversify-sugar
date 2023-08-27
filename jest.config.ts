import type { JestConfigWithTsJest } from "ts-jest";

const jestUnitConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.spec.ts"],
  setupFiles: ["./test/jest.setup.ts"],
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

export default jestUnitConfig;
