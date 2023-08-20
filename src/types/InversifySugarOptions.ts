import { Container, interfaces } from "inversify";
import ModuleMetadata from "./ModuleMetadata";
import Constructor from "./Constructor";

export default interface InversifySugarOptions {
  /**
   * @description The default scope for bindings (providers prop of @module decorator).
   */
  defaultScope: interfaces.BindingScope;

  /**
   * @description Flag that enables debug mode.
   */
  debug: boolean;

  /**
   * @description Callback that is called when a module is imported.
   * @param container The container that is used to import the module.
   * @param metadata The metadata of the module.
   * @param Module The module that is imported.
   * @returns void
   * */
  onModuleImported:
    | ((
        container: Container,
        metadata: ModuleMetadata,
        Module: Constructor
      ) => void)
    | undefined;
}