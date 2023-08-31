import { Newable } from "../types";
import ExportedProvider, {
  DetailedExportedProvider,
  TokenExportedProvider,
} from "../types/ExportedProvider";
import ExportedProviderRef from "../types/ExportedProviderRef";
import ModuleMetadata from "../types/ModuleMetadata";
import { IMPORTED_TAG, MODULE_METADATA_KEYS, PROVIDED_TAG } from "./constants";
import getAllMetadata from "./getAllMetadata";
import messagesMap from "./messagesMap";
import isDetailedExportedProvider from "./validation/isDetailedExportedProvider";

export default function createExportedProviderRef(
  Module: Newable,
  exportedProvider: ExportedProvider
): ExportedProviderRef[] {
  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    MODULE_METADATA_KEYS
  );
  const exportedProviderRefs: ExportedProviderRef[] = [];
  const detailedExportedProvider = (
    isDetailedExportedProvider(exportedProvider)
      ? exportedProvider
      : {
          provide: exportedProvider as TokenExportedProvider,
          deep: false,
          multiple: false,
        }
  ) as DetailedExportedProvider;
  const isBound = detailedExportedProvider.deep
    ? metadata.container.isBoundTagged(
        detailedExportedProvider.provide,
        PROVIDED_TAG,
        true
      ) &&
      metadata.container.isBoundTagged(
        detailedExportedProvider.provide,
        IMPORTED_TAG,
        true
      )
    : metadata.container.isBoundTagged(
        detailedExportedProvider.provide,
        PROVIDED_TAG,
        true
      );
  const getValue = () => {
    const results = [];

    results.push(
      ...metadata.container.getAllTagged(
        detailedExportedProvider.provide,
        PROVIDED_TAG,
        true
      )
    );
    if (detailedExportedProvider.deep) {
      results.push(
        ...metadata.container.getAllTagged(
          detailedExportedProvider.provide,
          IMPORTED_TAG,
          true
        )
      );
    }

    return results.length === 1 ? results[0] : results;
  };

  if (isBound) {
    exportedProviderRefs.push({
      multiple: !!detailedExportedProvider.multiple,
      provide: detailedExportedProvider.provide,
      getValue,
    });
  } else {
    throw new Error(
      messagesMap.notBoundProviderExported(
        Module.name,
        detailedExportedProvider.provide.toString()
      )
    );
  }

  return exportedProviderRefs;
}
