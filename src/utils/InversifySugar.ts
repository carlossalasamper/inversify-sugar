import { Container, interfaces } from "inversify";
import { Constructor } from "../types";
import importModule from "./importModule";
import ModuleMetadata from "../types/ModuleMetadata";
import messagesMap from "./messagesMap";

/**
 * @description InversifySugar is a utility class that helps you to bootstrap inversify and configure it.
 */
export default class InversifySugar {
  /**
   * @description The default scope for bindings (providers prop of @module decorator).
   */
  public static defaultScope: interfaces.BindingScope = "Transient";

  /**
   * @description Flag that enables debug mode.
   */
  public static debug = false;

  private static isRunning = false;

  private static _globalContainer = new Container();

  private static _onModuleImported:
    | ((
        container: Container,
        metadata: ModuleMetadata,
        Module: Constructor
      ) => void)
    | undefined;

  static get globalContainer() {
    return InversifySugar._globalContainer;
  }

  /**
   * @description This method is used to bootstrap inversify and import the AppModule.
   */
  static run(AppModule: Constructor) {
    if (InversifySugar.isRunning) {
      throw new Error(messagesMap.alreadyRunning);
    }

    InversifySugar.isRunning = true;

    importModule(AppModule, true);
  }

  static onModuleImported(
    container: Container,
    metadata: ModuleMetadata,
    Module: Constructor
  ) {
    InversifySugar._onModuleImported?.(container, metadata, Module);

    if (InversifySugar.debug) {
      console.log(messagesMap.moduleImported(Module.name));
    }
  }

  static setOnModuleImported(
    value: (
      container: Container,
      metadata: ModuleMetadata,
      Module: Constructor
    ) => void
  ) {
    InversifySugar._onModuleImported = value;
  }
}
