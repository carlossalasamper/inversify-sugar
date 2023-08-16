import { Constructor } from "../types";
import ExportedProvider, {
  DetailedExportedProvider,
  TokenExportedProvider,
} from "../types/ExportedProvider";
import ExportedProviderRef from "../types/ExportedProviderRef";
import ModuleMetadata, { moduleMetadataKeys } from "../types/ModuleMetadata";
import getAllMetadata from "./getAllMetadata";
import messagesMap from "./messagesMap";
import isDetailedExportedProvider from "./validation/isDetailedExportedProvider";
import isTokenExportedProvider from "./validation/isTokenExportedProvider";

export default function createExportedProviderRef(
  Module: Constructor,
  exportedProvider: ExportedProvider
): ExportedProviderRef[] {
  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    moduleMetadataKeys
  );
  const exportedProviderRefs: ExportedProviderRef[] = [];

  if (isDetailedExportedProvider(exportedProvider)) {
    const detailedExportedProvider =
      exportedProvider as DetailedExportedProvider;
    const isBound = metadata.container.isBound(
      detailedExportedProvider.provide
    );
    const getValue = () => {
      return detailedExportedProvider.deep
        ? metadata.container.getAll(detailedExportedProvider.provide)
        : metadata.container.getAll(detailedExportedProvider.provide); // TODO: get only current container bindings
    };

    if (isBound) {
      exportedProviderRefs.push({
        multiple: true,
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
  } else if (isTokenExportedProvider(exportedProvider)) {
    const tokenExportedProvider = exportedProvider as TokenExportedProvider;
    const isBound = metadata.container.isBound(tokenExportedProvider);
    const getValue = () => {
      return metadata.container.get(tokenExportedProvider);
    };

    if (isBound) {
      exportedProviderRefs.push({
        multiple: false,
        provide: tokenExportedProvider,
        getValue,
      });
    } else {
      throw new Error(
        messagesMap.notBoundProviderExported(
          Module.name,
          tokenExportedProvider.toString()
        )
      );
    }
  }

  return exportedProviderRefs;
}
