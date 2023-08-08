import { Container, interfaces } from "inversify";
import { Constructor } from "../types";
import importModule from "./importModule";
import ModuleMetadata from "../types/ModuleMetadata";
import clc from "cli-color";

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

  public static _rootContainer: Container | undefined;

  private static _onModuleImported:
    | ((
        container: Container,
        metadata: ModuleMetadata,
        Module: Constructor
      ) => void)
    | undefined;

  /**
   * @description This method starts the application by importing the root module.
   */
  static start(AppModule: Constructor): Container {
    return importModule(AppModule, true);
  }

  static get onModuleImported() {
    return (
      container: Container,
      metadata: ModuleMetadata,
      Module: Constructor
    ) => {
      InversifySugar._onModuleImported?.(container, metadata, Module);

      if (InversifySugar.debug) {
        console.log(
          clc.bold("[@module]"),
          clc.green(`${Module.name} imported.`)
        );
      }
    };
  }

  static set onModuleImported(
    value: (
      container: Container,
      metadata: ModuleMetadata,
      Module: Constructor
    ) => void
  ) {
    InversifySugar._onModuleImported = value;
  }

  static get rootContainer() {
    if (!InversifySugar._rootContainer) {
      console.warn(
        clc.xterm(250)("You are accessing the root container before it is set.")
      );
    }

    return InversifySugar._rootContainer;
  }

  static setRootContainer(container: Container | undefined) {
    InversifySugar._rootContainer = container;
  }
}
