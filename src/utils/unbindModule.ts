import { Constructor } from "../types";
import ModuleMetadata from "../types/ModuleMetadata";
import { IS_MODULE_KEY, MODULE_METADATA_KEYS } from "./constants";
import getAllMetadata from "./getAllMetadata";
import messagesMap from "./messagesMap";

export default function unbindModule(Module: Constructor) {
  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    MODULE_METADATA_KEYS
  );

  if (metadata.isBinded) {
    metadata.container.unbindAll();
    metadata.isBinded = false;
  }

  for (const item of metadata.imports) {
    const isModule = !!Reflect.getMetadata(IS_MODULE_KEY, item.prototype);

    if (isModule) {
      unbindModule(item);
    } else {
      console.warn(messagesMap.notAModuleUnbinded(item.name));
    }
  }
}
