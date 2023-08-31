import { NewableModule } from "../types/Module";
import ModuleMetadata from "../types/ModuleMetadata";
import { IS_MODULE_KEY, MODULE_METADATA_KEYS } from "./constants";
import getAllMetadata from "./getAllMetadata";
import messagesMap from "./messagesMap";
import isNewable from "./validation/isNewable";

export default function unbindModule(Module: NewableModule) {
  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    MODULE_METADATA_KEYS
  );
  const newableModulesImported: NewableModule[] = metadata.imports.filter(
    (item) => isNewable(item)
  ) as NewableModule[];

  if (metadata.isBinded) {
    metadata.container.unbindAll();
    metadata.isBinded = false;
  }

  for (const item of newableModulesImported) {
    const isModule = !!Reflect.getMetadata(IS_MODULE_KEY, item.prototype);

    if (isModule) {
      unbindModule(item);
    } else {
      console.warn(messagesMap.notAModuleUnbinded(item.name));
    }
  }
}
