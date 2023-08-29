/* eslint-disable @typescript-eslint/no-explicit-any */
import { Newable } from "../types";
import ModuleMetadata, { ModuleMetadataArgs } from "../types/ModuleMetadata";
import { InversifySugar, ModuleContainer } from "../utils";

export default function module({
  imports = [],
  providers: allProviders = [],
  exports = [],
  addons = [],
}: ModuleMetadataArgs) {
  return (target: Newable) => {
    const addonsResult = addons.map((addon) => addon(target));
    const addonsMetadata = {
      imports: addonsResult.map((result) => result.imports || []).flat(),
      providers: addonsResult.map((result) => result.providers || []).flat(),
      exports: addonsResult.map((result) => result.exports || []).flat(),
    };

    allProviders = allProviders.concat(addonsMetadata.providers);
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
      imports: imports.concat(addonsMetadata.imports),
      providers,
      globalProviders,
      exports: exports.concat(addonsMetadata.exports),
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
