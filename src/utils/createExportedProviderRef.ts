import { Newable } from "../types";
import ExportedProvider, {
  DetailedExportedProvider,
  TokenExportedProvider,
} from "../types/ExportedProvider";
import ExportedProviderRef from "../types/ExportedProviderRef";
import ModuleMetadata from "../types/ModuleMetadata";
import { MODULE_METADATA_KEYS } from "./constants";
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
    ? metadata.sharedContainer.isBound(detailedExportedProvider.provide)
    : metadata.privateContainer.isBound(detailedExportedProvider.provide);
  const getValue = () => {
    let result;

    if (detailedExportedProvider.multiple || detailedExportedProvider.deep) {
      if (detailedExportedProvider.deep) {
        result = [];

        result.push(
          ...metadata.privateContainer.getAll(detailedExportedProvider.provide)
        );
        result.push(
          ...metadata.sharedContainer.getAll(detailedExportedProvider.provide)
        );
      } else {
        result = metadata.privateContainer.getAll(
          detailedExportedProvider.provide
        );
      }
    } else {
      result = metadata.privateContainer.get(detailedExportedProvider.provide);
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
