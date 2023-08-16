import { Constructor, InversifySugar, module } from "../../../src";
import messagesMap from "../../../src/utils/messagesMap";

@module({})
class ModuleA {}
@module({})
class ModuleB {}

const appModuleImports: Constructor[] = [ModuleA, ModuleB];

@module({
  imports: appModuleImports,
})
class AppModule {}

describe("InversifySugar", () => {
  const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
  const inversifySugarOnModuleImported = jest.spyOn(
    InversifySugar,
    "onModuleImported"
  );
  const onModuleImported = jest.fn();

  beforeAll(() => {
    InversifySugar.reset();
    InversifySugar.setOnModuleImported(onModuleImported);
    InversifySugar.options.debug = true;
  });

  it("InversifySugar.run should be called once.", () => {
    InversifySugar.run(AppModule);
    expect(() => InversifySugar.run(AppModule)).toThrow(
      messagesMap.alreadyRunning
    );
  });

  it("InversifySugar.onModuleImported should be called once per imported module.", () => {
    expect(inversifySugarOnModuleImported).toHaveBeenCalledTimes(
      appModuleImports.length
    );
    expect(onModuleImported).toHaveBeenCalledTimes(appModuleImports.length);
  });

  it("Should print a message for each imported module.", () => {
    for (const importedModule of appModuleImports) {
      expect(consoleLogMock).toHaveBeenCalledWith(
        messagesMap.moduleImported(importedModule.name)
      );
    }
  });

  it("Should reset InversifySugar even if its nto running", () => {
    InversifySugar.reset();
    expect(() => InversifySugar.run(AppModule)).not.toThrow();
  });
});
