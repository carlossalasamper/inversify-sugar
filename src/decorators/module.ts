/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from "inversify";
import { Constructor } from "../types";
import ModuleMetadata, { ModuleMetadataArgs } from "../types/ModuleMetadata";
import { InversifySugar } from "../utils";

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
      imports,
      providers: scopedProviders,
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
