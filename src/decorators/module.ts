import { Container } from "inversify";
import { Constructor } from "../types";
import ModuleMetadata, { ModuleMetadataArgs } from "../types/ModuleMetadata";

export default function module({
  imports = [],
  providers = [],
  exports = [],
}: ModuleMetadataArgs) {
  return (target: Constructor) => {
    const metadata = {
      isModule: true,
      isBinded: false,
      container: new Container(),
      imports,
      providers,
      exports,
    } as ModuleMetadata;

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
