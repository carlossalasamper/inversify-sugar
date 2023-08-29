/* eslint-disable @typescript-eslint/no-explicit-any */
import { Newable } from "../types";
import ModuleMetadata, { ModuleMetadataArgs } from "../types/ModuleMetadata";
import { InversifySugar, ModuleContainer } from "../utils";

export default function module({
  imports = [],
  providers: allProviders = [],
  exports = [],
}: ModuleMetadataArgs) {
  return (target: Newable) => {
    const providers = allProviders.filter(
      (provider: any) => !provider.isGlobal
    );
    const globalProviders = allProviders.filter(
      (provider: any) => !!provider.isGlobal
    );
    const metadata: ModuleMetadata = {
      id: new Date().getTime(),
      isModule: true,
      isBinded: false,
      container: new ModuleContainer(),
      imports,
      providers,
      globalProviders,
      exports,
    };

    metadata.container.parent = InversifySugar.globalContainer;

    for (const key in metadata) {
      if (metadata.hasOwnProperty(key)) {
        Reflect.defineMetadata(
          key,
          metadata[key as keyof ModuleMetadata],
          target.prototype
        );
      }
    }
  };
}
