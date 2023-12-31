import { injectable } from "inversify";
import {
  InversifySugar,
  getModuleContainer,
  imported,
  module,
} from "../../src";

describe("@imported", () => {
  afterAll(() => {
    InversifySugar.reset();
  });

  it("Should resolve a imported provider injected into another provider", () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class TestModule {}

    @injectable()
    class AppController {
      constructor(
        @imported(TestService) public readonly testService: TestService
      ) {}
    }

    @module({
      imports: [TestModule],
      providers: [AppController],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);

    expect(
      appModuleContainer.getProvided(AppController).testService
    ).toBeInstanceOf(TestService);
  });
});
