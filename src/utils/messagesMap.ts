/* eslint-disable @typescript-eslint/no-explicit-any */
import clc from "cli-color";
import { interfaces } from "inversify";
import getServiceIdentifierName from "./getServiceIdentifierName";

const messagesMap = {
  alreadyRunning: clc.red("You are trying to run InversifySugar twice."),
  resolveProvider: (
    serviceIdentifier: interfaces.ServiceIdentifier,
    containerId: number
  ) => {
    const serviceIdentifierName = getServiceIdentifierName(serviceIdentifier);

    return `${clc.bold("[provider]")} ${clc.green(
      `Resolving ${clc.bold(serviceIdentifierName)} in container ${clc.bold(
        containerId
      )}.`
    )}`;
  },
  rootModuleProvidersBinded: (moduleName: string, containerId: number) =>
    `${clc.bold("[@rootModule]")} ${clc.green(
      `${clc.bold(moduleName)} providers binded. Container: ${containerId}`
    )}`,
  moduleProvidersBinded: (moduleName: string, containerId: number) =>
    `${clc.bold("[@module]")} ${clc.green(
      `${clc.bold(moduleName)} providers binded. Container: ${containerId}`
    )}`,
  notAModuleImported: (importedItemName: string) =>
    `importModule() was called with a class that is not a module: ${importedItemName}. Skipping...`,
  notAModuleUnbinded: (unbindedItemName: string) =>
    `unbindModule() was called with a class that is not a module: ${unbindedItemName}. Skipping...`,
  notBoundProviderExported: (moduleName: string, provide: unknown) =>
    `You are trying to export a provider that is not bound in the module ${moduleName}: ${provide}.`,
};

export default messagesMap;
