import Provider from "./Provider";
import { Newable } from ".";
import ExportedProvider from "./ExportedProvider";
import { Container } from "inversify";

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
}

export default interface ModuleMetadata {
  id: number;
  isModule: true;
  isBinded: boolean;
  privateContainer: Container;
  sharedContainer: Container;
  imports: Newable[];
  providers: Provider[];
  globalProviders: Provider[];
  exports: ExportedProvider[];
}
