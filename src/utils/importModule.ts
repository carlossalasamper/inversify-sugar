/* eslint-disable @typescript-eslint/no-explicit-any */
import getAllMetadata from "./getAllMetadata";
import bindProvider from "./bindProvider";
import ModuleMetadata, {
  IsModuleKey,
  moduleMetadataKeys,
} from "../types/ModuleMetadata";
import { Constructor } from "../types";
import InversifySugar from "./InversifySugar";

export default function importModule(Module: Constructor, isRoot = false) {
  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    moduleMetadataKeys
  );

  for (const provider of metadata.providers) {
    bindProvider(provider, metadata.container);
  }

  if (metadata.imports.length > 0) {
    for (const item of metadata.imports) {
      const isModule = !!Reflect.getMetadata(IsModuleKey, item.prototype);

      if (isModule) {
        const moduleMetadata = getAllMetadata<ModuleMetadata>(
          item.prototype,
          moduleMetadataKeys
        );

        importModule(item);

        for (const exportedItem of moduleMetadata.exports) {
          bindProvider(exportedItem, metadata.container);
        }
      } else {
        console.warn(
          `Module ${Module.name} imports ${item.name} which is not a module.`
        );
      }
    }
  }

  if (isRoot) {
    InversifySugar.setRootContainer(metadata.container);
  } else {
    InversifySugar.onModuleImported(metadata.container, metadata, Module);
  }

  return metadata.container;
}
