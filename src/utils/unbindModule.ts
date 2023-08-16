import { Constructor } from "../types";
import ModuleMetadata, {
  isModuleKey,
  moduleMetadataKeys,
} from "../types/ModuleMetadata";
import getAllMetadata from "./getAllMetadata";
import messagesMap from "./messagesMap";

export default function unbindModule(Module: Constructor) {
  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    moduleMetadataKeys
  );

  if (metadata.isBinded) {
    metadata.container.unbindAll();
    metadata.isBinded = false;
  }

  for (const item of metadata.imports) {
    const isModule = !!Reflect.getMetadata(isModuleKey, item.prototype);

    if (isModule) {
      unbindModule(item);
    } else {
      console.warn(messagesMap.notAModuleUnbinded(item.name));
    }
  }
}
