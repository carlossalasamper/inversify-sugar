import { ModuleMetadataArgs } from "./ModuleMetadata";
import Newable from "./Newable";

type ModuleAddon<T = void> = (
  payload: T
) => (Module: Newable) => Omit<ModuleMetadataArgs, "addons">;

export default ModuleAddon;
