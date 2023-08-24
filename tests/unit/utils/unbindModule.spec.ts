import { injectable } from "inversify";
import { InversifySugar, getModuleContainer, module } from "../../../src";
import importModule from "../../../src/utils/importModule";
import unbindModule from "../../../src/utils/unbindModule";
import messagesMap from "../../../src/utils/messagesMap";

describe("unbindModule", () => {
  beforeEach(() => {
    InversifySugar.reset();
  });

  it("Should unbind a module with imports.", () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class ImportsModule {}

    importModule(ImportsModule);

    unbindModule(ImportsModule);

    const testModuleContainer = getModuleContainer(TestModule);

    expect(testModuleContainer.isBound(TestService)).toBe(false);
  });

  it("Should unbind a module with providers.", () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
    })
    class ProvidersModule {}

    importModule(ProvidersModule);

    unbindModule(ProvidersModule);

    expect(getModuleContainer(ProvidersModule).isBound(TestService)).toBe(
      false
    );
  });

  it("Should unbind a module with exports and access exported provider.", () => {
    @injectable()
    class TestService {}

    @module({
      providers: [TestService],
      exports: [TestService],
    })
    class TestModule {}

    @module({
      imports: [TestModule],
    })
    class ExportsModule {}

    importModule(ExportsModule);

    unbindModule(ExportsModule);

    expect(getModuleContainer(ExportsModule).isBound(TestService)).toBe(false);
  });

  it("Should print a warning when unbinding a class that is not a module.", () => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    class NotAModule {}

    @module({
      imports: [NotAModule],
    })
    class ImportsModule {}

    unbindModule(ImportsModule);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      messagesMap.notAModuleUnbinded(NotAModule.name)
    );
  });
});
