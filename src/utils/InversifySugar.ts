import { Container } from "inversify";
import { Constructor } from "../types";
import importModule from "./importModule";
import ModuleMetadata from "../types/ModuleMetadata";
import messagesMap from "./messagesMap";
import InversifySugarState from "../types/InversifySugarState";
import InversifySugarOptions from "../types/InversifySugarOptions";
import unbindModule from "./unbindModule";

/**
 * @description InversifySugar is a utility class that helps you to bootstrap inversify and configure it.
 */
export default class InversifySugar {
  public static get defaultOptions(): InversifySugarOptions {
    return {
      debug: false,
      defaultScope: "Transient",
      onModuleImported: undefined,
    };
  }

  public static readonly options: InversifySugarOptions = Object.assign(
    {},
    InversifySugar.defaultOptions
  );

  private static state: InversifySugarState = {
    isRunning: false,
    globalContainer: new Container(),
    rootModule: undefined,
  };

  static get globalContainer() {
    return InversifySugar.state.globalContainer;
  }

  /**
   * @description This method is used to bootstrap inversify and import the AppModule.
   */
  static run(AppModule: Constructor) {
    if (InversifySugar.state.isRunning) {
      throw new Error(messagesMap.alreadyRunning);
    }

    InversifySugar.state.isRunning = true;
    InversifySugar.state.rootModule = AppModule;

    importModule(AppModule, true);
  }

  /**
   * @description This method is used to reset the options and state of the dependency system.
   * It is useful for testing purposes.
   */
  static reset() {
    InversifySugar.state.rootModule &&
      unbindModule(InversifySugar.state.rootModule);

    InversifySugar.globalContainer.unbindAll();
    Object.assign(InversifySugar.state, {
      isRunning: false,
      rootModule: undefined,
    });

    Object.assign(InversifySugar.options, InversifySugar.defaultOptions);
  }

  static onModuleImported(
    container: Container,
    metadata: ModuleMetadata,
    Module: Constructor
  ) {
    InversifySugar.options.onModuleImported?.(container, metadata, Module);

    if (InversifySugar.options.debug) {
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
    InversifySugar.options.onModuleImported = value;
  }
}
