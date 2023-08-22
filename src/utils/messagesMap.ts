/* eslint-disable @typescript-eslint/no-explicit-any */
import clc from "cli-color";
import { interfaces } from "inversify";

const messagesMap = {
  alreadyRunning: clc.red("You are trying to run InversifySugar twice."),
  resolveProvider: (
    serviceIdentifier: interfaces.ServiceIdentifier,
    containerId: number
  ) => {
    const serviceIdentifierName = (serviceIdentifier as any).name
      ? `class ${(serviceIdentifier as any).name} {}`
      : serviceIdentifier.toString();

    return `${clc.bold("[provider]")} ${clc.green(
      `Trying to resolve ${clc.bold(
        serviceIdentifierName
      )} in container ${clc.bold(containerId)}.`
    )}`;
  },
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
