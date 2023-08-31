import Provider from "./Provider";
import ExportedProvider from "./ExportedProvider";
import { ModuleContainer } from "../utils";
import Module from "./Module";

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
  imports?: Module[];

  /**
   * @description Optional list of providers defined in this module which have to be
   * registered.
   */
  providers?: Provider[];

  /**
   * @description Optional list of providers exported from this module.
   */
  exports?: ExportedProvider[];
}

export default interface ModuleMetadata {
  id: number;
  isModule: true;
  isBinded: boolean;
  container: ModuleContainer;
  imports: Module[];
  providers: Provider[];
  globalProviders: Provider[];
  exports: ExportedProvider[];
}
