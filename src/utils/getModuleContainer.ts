import { Constructor } from "../types";
import ModuleMetadata, { moduleMetadataKeys } from "../types/ModuleMetadata";
import getAllMetadata from "./getAllMetadata";

export default function getModuleContainer(Module: Constructor) {
  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    moduleMetadataKeys
  );

  return metadata.container;
}
