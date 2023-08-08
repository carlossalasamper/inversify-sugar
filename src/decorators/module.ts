import { Constructor } from "../types";
import ModuleMetadata, { ModuleMetadataArgs } from "../types/ModuleMetadata";

export default function module({
  imports = [],
  providers = [],
}: ModuleMetadataArgs) {
  return (target: Constructor) => {
    const metadata = {
      isModule: true,
      imports,
      providers,
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
