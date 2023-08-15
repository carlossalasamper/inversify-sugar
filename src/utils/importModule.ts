/* eslint-disable @typescript-eslint/no-explicit-any */
import getAllMetadata from "./getAllMetadata";
import bindProvider from "./bindProvider";
import ModuleMetadata, {
  containerKey,
  isBindedKey,
  isModuleKey,
  moduleMetadataKeys,
} from "../types/ModuleMetadata";
import { Constructor } from "../types";
import InversifySugar from "./InversifySugar";
import { Container } from "inversify";
import messagesMap from "./messagesMap";

export default function importModule(Module: Constructor, isRoot = false) {
  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    moduleMetadataKeys
  );
  let moduleContainer = metadata.container;

  if (!metadata.isBinded) {
    // If it's the root module, bind the providers to the global container.
    if (isRoot) {
      for (const provider of metadata.providers) {
        bindProvider(provider, InversifySugar.globalContainer);
      }
    } else {
      for (const provider of metadata.globalProviders) {
        bindProvider(provider, InversifySugar.globalContainer);
      }

      // If it's not the root module, merge the module container with the global container.
      moduleContainer = Container.merge(
        InversifySugar.globalContainer,
        moduleContainer
      ) as Container;
    }

    // Bind the providers to the module container.
    for (const provider of metadata.providers) {
      bindProvider(provider, moduleContainer);
    }

    // Bind the exported providers to the exports container.
    for (const exportedProvider of metadata.exports) {
      bindProvider(exportedProvider, metadata.exportsContainer);
    }

    if (metadata.imports.length > 0) {
      for (const item of metadata.imports) {
        const isModule = !!Reflect.getMetadata(isModuleKey, item.prototype);

        if (isModule) {
          const moduleMetadata = getAllMetadata<ModuleMetadata>(
            item.prototype,
            moduleMetadataKeys
          );

          importModule(item);

          moduleContainer = Container.merge(
            moduleContainer,
            moduleMetadata.exportsContainer
          ) as Container;
        } else {
          console.warn(messagesMap.notAModuleImported(Module.name, item.name));
        }
      }
    }

    Reflect.defineMetadata(containerKey, moduleContainer, Module.prototype);
    Reflect.defineMetadata(isBindedKey, true, Module.prototype);

    if (!isRoot) {
      InversifySugar.onModuleImported(moduleContainer, metadata, Module);
    }
  }

  return moduleContainer;
}
