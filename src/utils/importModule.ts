/* eslint-disable @typescript-eslint/no-explicit-any */
import getAllMetadata from "./getAllMetadata";
import bindProvider from "./bindProvider";
import ModuleMetadata, {
  isBindedKey,
  moduleMetadataKeys,
} from "../types/ModuleMetadata";
import { Constructor } from "../types";
import InversifySugar from "./InversifySugar";
import messagesMap from "./messagesMap";
import ExportedProviderRef from "../types/ExportedProviderRef";
import createExportedProviderRef from "./createExportedProviderRef";
import processImports from "./processImports";

export default function importModule(
  Module: Constructor,
  isRoot = false
): ExportedProviderRef[] {
  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    moduleMetadataKeys
  );
  const exportedProviders: ExportedProviderRef[] = [];

  if (metadata.isModule) {
    if (isRoot) {
      importRootModule(Module);
    } else {
      exportedProviders.push(...importChildModule(Module));
    }

    Reflect.defineMetadata(isBindedKey, true, Module.prototype);
  } else {
    console.warn(messagesMap.notAModuleImported(Module.name));
  }

  return exportedProviders;
}

/**
 * @description This function is used to import a root module.
 * @param Module
 * @returns
 */
function importRootModule(Module: Constructor) {
  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    moduleMetadataKeys
  );

  if (!metadata.isBinded) {
    for (const provider of metadata.providers) {
      bindProvider(provider, InversifySugar.globalContainer);
    }

    processImports(metadata.container, metadata.imports);
  }
}

/**
 * @description This function is used to import a child module.
 * @param Module
 */
function importChildModule(Module: Constructor) {
  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    moduleMetadataKeys
  );
  const exportedProviderRefs: ExportedProviderRef[] = [];

  if (!metadata.isBinded) {
    for (const provider of metadata.providers) {
      bindProvider(provider, metadata.container);
    }

    for (const provider of metadata.globalProviders) {
      bindProvider(provider, InversifySugar.globalContainer);
    }

    processImports(metadata.container, metadata.imports);
  }

  for (const exportedProvider of metadata.exports) {
    exportedProviderRefs.push(
      ...createExportedProviderRef(Module, exportedProvider)
    );
  }

  InversifySugar.onModuleImported(metadata.container, metadata, Module);

  return exportedProviderRefs;
}
