import { Constructor } from "../types";
import ExportedProvider, {
  MultiExportedProvider,
  SingleExportedProvider,
} from "../types/ExportedProvider";
import ExportedProviderRef from "../types/ExportedProviderRef";
import ModuleMetadata, { moduleMetadataKeys } from "../types/ModuleMetadata";
import getAllMetadata from "./getAllMetadata";
import messagesMap from "./messagesMap";
import isMultiExportedProvider from "./validation/isMultiExportedProvider";
import isSingleExportedProvider from "./validation/isSingleExportedProvider";

export default function createExportedProviderRef(
  Module: Constructor,
  exportedProvider: ExportedProvider
): ExportedProviderRef[] {
  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    moduleMetadataKeys
  );
  const exportedProviderRefs: ExportedProviderRef[] = [];

  if (isMultiExportedProvider(exportedProvider)) {
    const multiExportedProvider = exportedProvider as MultiExportedProvider;
    const isBound = metadata.container.isBound(multiExportedProvider.provide);
    const getValue = () => {
      return metadata.container.getAll(multiExportedProvider.provide);
    };

    if (isBound) {
      exportedProviderRefs.push({
        provide: multiExportedProvider.provide,
        getValue,
      });
    } else {
      throw new Error(
        messagesMap.notBoundProviderExported(
          Module.name,
          multiExportedProvider.provide.toString()
        )
      );
    }
  } else if (isSingleExportedProvider(exportedProvider)) {
    const singleExportedProvider = exportedProvider as SingleExportedProvider;
    const isBound = metadata.container.isBound(singleExportedProvider);
    const getValue = () => {
      return metadata.container.get(singleExportedProvider);
    };

    if (isBound) {
      exportedProviderRefs.push({
        provide: singleExportedProvider,
        getValue,
      });
    } else {
      throw new Error(
        messagesMap.notBoundProviderExported(
          Module.name,
          singleExportedProvider.toString()
        )
      );
    }
  }

  return exportedProviderRefs;
}
