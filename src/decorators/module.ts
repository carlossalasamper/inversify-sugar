/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from "inversify";
import { Constructor } from "../types";
import ModuleMetadata, { ModuleMetadataArgs } from "../types/ModuleMetadata";

export default function module({
  imports = [],
  providers = [],
  exports = [],
}: ModuleMetadataArgs) {
  return (target: Constructor) => {
    const scopedProviders = providers.filter(
      (provider: any) => !provider.isGlobal
    );
    const globalProviders = providers.filter(
      (provider: any) => !!provider.isGlobal
    );
    const metadata: ModuleMetadata = {
      isModule: true,
      isBinded: false,
      container: new Container(),
      exportsContainer: new Container(),
      imports,
      providers: scopedProviders,
      globalProviders,
      exports,
    };

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
