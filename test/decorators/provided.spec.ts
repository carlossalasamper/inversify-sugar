import { injectable } from "inversify";
import { InversifySugar, getModuleContainer, module } from "../../src";
import provided from "../../src/decorators/provided";

describe("@provided", () => {
  afterAll(() => {
    InversifySugar.reset();
  });

  it("Should resolve a module provider injected into another provider", () => {
    @injectable()
    class TestService {}

    @injectable()
    class TestController {
      constructor(
        @provided(TestService) public readonly testService: TestService
      ) {}
    }

    @module({
      providers: [TestService, TestController],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const appModuleContainer = getModuleContainer(AppModule);

    expect(
      appModuleContainer.getProvided(TestController).testService
    ).toBeInstanceOf(TestService);
  });
});
