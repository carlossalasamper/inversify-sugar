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
    let result;

    if (detailedExportedProvider.multiple || detailedExportedProvider.deep) {
      if (detailedExportedProvider.deep) {
        result = [];

        result.push(
          ...metadata.container.getAllTagged(
            detailedExportedProvider.provide,
            PROVIDED_TAG,
            true
          )
        );
        result.push(
          ...metadata.container.getAllTagged(
            detailedExportedProvider.provide,
            IMPORTED_TAG,
            true
          )
        );
      } else {
        result = metadata.container.getAllTagged(
          detailedExportedProvider.provide,
          PROVIDED_TAG,
          true
        );
      }
    } else {
      result = metadata.container.getTagged(
        detailedExportedProvider.provide,
        PROVIDED_TAG,
        true
      );
    }

    return result;
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
