import Provider from "./Provider";
import { ModuleAddon, Newable } from ".";
import ExportedProvider from "./ExportedProvider";
import { ModuleContainer } from "../utils";

/**
 * @description Interface defining the property object that describes the module.
 *
 * @publicApi
 */
export interface ModuleMetadataArgs {
  /**
   * @description Optional list of submodules defined in this module which have to be
   * registered.
   */
  imports?: Newable[];

  /**
   * @description Optional list of providers defined in this module which have to be
   * registered.
   */
  providers?: Provider[];

  /**
   * @description Optional list of providers exported from this module.
   */
  exports?: ExportedProvider[];

  /**
   * @description Optional list of ModuleAddon to be applied to this module.
   */
  addons?: ReturnType<ModuleAddon>[];
}

export default interface ModuleMetadata {
  id: number;
  isModule: true;
  isBinded: boolean;
  container: ModuleContainer;
  imports: Newable[];
  providers: Provider[];
  globalProviders: Provider[];
  exports: ExportedProvider[];
}
