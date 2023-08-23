import type { JestConfigWithTsJest } from "ts-jest";

const jestIntegrationConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/integration/**/*.spec.ts"],
  setupFiles: ["./tests/jest.setup.ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        compiler: "ttypescript",
      },
    ],
  },
};

export default jestIntegrationConfig;
