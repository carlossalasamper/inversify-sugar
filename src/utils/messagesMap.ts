import clc from "cli-color";

const messagesMap = {
  alreadyRunning: clc.red("You are trying to run InversifySugar twice."),
  moduleImported: (moduleName: string) =>
    `${clc.bold("[@module]")} ${clc.green(`${moduleName} imported.`)}`,
  notAModuleImported: (moduleName: string, importedItemName: string) =>
    `Module ${moduleName} imports ${importedItemName} which is not a module.`,
};

export default messagesMap;
