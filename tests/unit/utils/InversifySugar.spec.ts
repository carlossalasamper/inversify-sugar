import { Container } from "inversify";
import { Constructor, InversifySugar, module } from "../../../src";
import clc from "cli-color";

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
  const consoleWarnMock = jest.spyOn(console, "warn").mockImplementation();
  const inversifySugarOnModuleImported = jest.spyOn(
    InversifySugar,
    "onModuleImported"
  );
  const onModuleImported = jest.fn();
  let runReturn: Container | undefined = undefined;

  InversifySugar.setOnModuleImported(onModuleImported);
  InversifySugar.debug = true;

  it("Inversify.rootContainer should be undefined before call run method.", () => {
    expect(InversifySugar.rootContainer).toBeUndefined();
    expect(consoleWarnMock).toHaveBeenCalledTimes(1);
  });

  it("InversifySugar.run should return a container.", () => {
    runReturn = InversifySugar.run(AppModule);

    expect(runReturn).toBeDefined();
    expect(runReturn).toBeInstanceOf(Container);
  });

  it("InversifySugar.rootContainer should be defined after call run method.", () => {
    expect(InversifySugar.rootContainer).toBeDefined();
    expect(InversifySugar.rootContainer).toBeInstanceOf(Container);
  });

  it("InversifySugar.rootContainer should be equal to container returned by run method.", () => {
    expect(InversifySugar.rootContainer).toBe(runReturn);
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
        clc.bold("[@module]"),
        clc.green(`${importedModule.name} imported.`)
      );
    }
  });
});
