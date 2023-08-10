import { keys } from "ts-transformer-keys";
import Provider from "./Provider";
import { Constructor } from ".";

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
  imports?: Constructor[];

  /**
   * Optional list of providers defined in this module which have to be
   * registered.
   */
  providers?: Provider[];
}

export default interface ModuleMetadata {
  isModule: true;
  imports: Constructor[];
  providers: Provider[];
}

export const IsModuleKey: keyof ModuleMetadata = "isModule";

export const moduleMetadataKeys = keys<ModuleMetadata>();
