/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from "inversify";
import { Newable } from "../types";
import ModuleMetadata, { ModuleMetadataArgs } from "../types/ModuleMetadata";
import { InversifySugar } from "../utils";
import loggerMiddleware from "../middlewares/loggerMiddleware";

export default function module({
  imports = [],
  providers = [],
  exports = [],
}: ModuleMetadataArgs) {
  return (target: Newable) => {
    const scopedProviders = providers.filter(
      (provider: any) => !provider.isGlobal
    );
    const globalProviders = providers.filter(
      (provider: any) => !!provider.isGlobal
    );
    const metadata: ModuleMetadata = {
      id: new Date().getTime(),
      isModule: true,
      isBinded: false,
      privateContainer: new Container(),
      sharedContainer: new Container(),
      imports,
      providers: scopedProviders,
      globalProviders,
      exports,
    };

    metadata.privateContainer.parent = InversifySugar.globalContainer;
    metadata.sharedContainer.parent = metadata.privateContainer;

    metadata.privateContainer.applyMiddleware(loggerMiddleware);
    metadata.sharedContainer.applyMiddleware(loggerMiddleware);

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
