import { injectable } from "inversify";
import { InversifySugar, module } from "../../../src";
import getModuleContainer from "../../../src/utils/getModuleContainer";
import importModule from "../../../src/utils/importModule";
import messagesMap from "../../../src/utils/messagesMap";

@injectable()
class TestService {}

describe("importModule", () => {
  it("Should import a module with imports.", () => {
    @module({
      providers: [TestService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class ImportsModule {}

    importModule(ImportsModule);

    const testModuleContainer = getModuleContainer(TestModule);

    expect(testModuleContainer.isBound(TestService)).toBe(true);
  });

  it("Should import a module with providers.", () => {
    @module({
      providers: [TestService],
    })
    class ProvidersModule {}

    expect(importModule(ProvidersModule).isBound(TestService)).toBe(true);
  });

  it("Should import a module with exports and access exported provider.", () => {
    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class ExportsModule {}

    const container = importModule(ExportsModule);

    expect(container.isBound(TestService)).toBe(true);
  });

  it("Should print a warning when importing a class that is not a module.", () => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    class NotAModule {}

    @module({
      imports: [NotAModule],
    })
    class ImportsModule {}

    importModule(ImportsModule);

    expect(consoleWarnSpy).toBeCalledWith(
      messagesMap.notAModuleImported(ImportsModule.name, NotAModule.name)
    );
  });

  it("Should bind the root module providers to the global container.", () => {
    @module({})
    class TestModule {}

    @injectable()
    class GlobalService {}

    @module({
      imports: [TestModule],
      providers: [GlobalService],
    })
    class RootModule {}

    importModule(RootModule, true);

    const testModuleContainer = getModuleContainer(TestModule);

    expect(testModuleContainer.isBound(GlobalService)).toBe(true);

    expect(InversifySugar.globalContainer.isBound(GlobalService)).toBe(true);
  });

  it("Should bind global providers to the global container.", () => {
    @injectable()
    class GlobalService {}

    @module({
      providers: [{ useClass: GlobalService, isGlobal: true }],
    })
    class GlobalModule {}

    @module({
      imports: [GlobalModule],
    })
    class RootModule {}

    importModule(RootModule, true);

    expect(InversifySugar.globalContainer.isBound(GlobalService)).toBe(true);
  });
});
