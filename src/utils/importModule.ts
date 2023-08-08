/* eslint-disable @typescript-eslint/no-explicit-any */
import getAllMetadata from "./getAllMetadata";
import bindProvider from "./bindProvider";
import ModuleMetadata, {
  IsModuleKey,
  moduleMetadataKeys,
} from "../types/ModuleMetadata";
import { Constructor } from "../types";
import { Container } from "inversify";
import InversifySugar from "./InversifySugar";

const container = new Container();

export default function importModule(Module: Constructor, isRoot = false) {
  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    moduleMetadataKeys
  );

  for (const provider of metadata.providers) {
    bindProvider(provider, container);
  }

  if (metadata.imports.length > 0) {
    for (const item of metadata.imports) {
      const isModule = !!Reflect.getMetadata(IsModuleKey, item.prototype);

      if (isModule) {
        importModule(item);
      } else {
        console.warn(
          `Module ${Module.name} imports ${item.name} which is not a module.`
        );
      }
    }
  }

  if (isRoot) {
    InversifySugar.setRootContainer(container);
  } else {
    InversifySugar.onModuleImported(container, metadata, Module);
  }

  return container;
}
