import { keys } from "ts-transformer-keys";
import Provider from "./Provider";
import { Constructor } from ".";

/**
 * Interface defining the property object that describes the module.
 *
 * @see [Modules](https://github.com/carlossalasamper/clincoud#modules)
 *
 * @publicApi
 */
export interface ModuleMetadataArgs {
  /**
   * Optional list of submodules defined in this module which have to be
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
