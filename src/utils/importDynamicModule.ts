/* eslint-disable @typescript-eslint/no-explicit-any */
import ExportedProviderRef from "../types/ExportedProviderRef";
import { DynamicModule } from "../types/Module";
import InversifySugar from "./InversifySugar";
import { bindProviderToContainer } from "./bindProviderToContainer";
import { bindProviderToModule } from "./bindProviderToModule";
import createExportedProviderRef from "./createExportedProviderRef";

export default function importDynamicModule({
  module,
  providers: allProviders,
  exports = [],
}: DynamicModule) {
  const exportedProviderRefs: ExportedProviderRef[] = [];
  const providers = allProviders.filter((provider: any) => !provider.isGlobal);
  const globalProviders = allProviders.filter(
    (provider: any) => !!provider.isGlobal
  );

  for (const provider of globalProviders) {
    bindProviderToContainer(provider, InversifySugar.globalContainer);
  }

  for (const provider of providers) {
    bindProviderToModule(provider, module);
  }

  for (const exportedProvider of exports) {
    exportedProviderRefs.push(
      ...createExportedProviderRef(module, exportedProvider)
    );
  }

  return exportedProviderRefs;
}
