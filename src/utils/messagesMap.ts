import clc from "cli-color";

const messagesMap = {
  alreadyRunning: clc.red("You are trying to run InversifySugar twice."),
  moduleImported: (moduleName: string) =>
    `${clc.bold("[@module]")} ${clc.green(`${moduleName} imported.`)}`,
  notAModuleImported: (importedItemName: string) =>
    `importModule() was called with a class that is not a module: ${importedItemName}. Skipping...`,
  notAModuleUnbinded: (unbindedItemName: string) =>
    `unbindModule() was called with a class that is not a module: ${unbindedItemName}. Skipping...`,
  notBoundProviderExported: (moduleName: string, provide: unknown) =>
    `You are trying to export a provider that is not bound in the module ${moduleName}: ${provide}.`,
};

export default messagesMap;
