import { Newable } from "../types";
import importModule from "./importModule";
import ModuleMetadata from "../types/ModuleMetadata";
import messagesMap from "./messagesMap";
import InversifySugarState from "../types/InversifySugarState";
import unbindModule from "./binding/unbindModule";
import { Container } from "inversify";
import inversifySugarOptions, {
  defaultInverseSugarOptions,
} from "./inversifySugarOptions";
import { loggerMiddleware } from "../middlewares";
import ModuleContainer from "./ModuleContainer";

/**
 * @description InversifySugar is a utility class that helps you to bootstrap inversify and configure it.
 */
export default class InversifySugar {
  private static readonly state: InversifySugarState = {
    isRunning: false,
    globalContainer: new Container(),
    rootModule: undefined,
  };

  public static get globalContainer() {
    return InversifySugar.state.globalContainer;
  }

  public static readonly options = inversifySugarOptions;

  /**
   * @description This method is used to bootstrap inversify and import the AppModule.
   */
  public static run(AppModule: Newable) {
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

    Object.assign(InversifySugar.options, defaultInverseSugarOptions);
  }

  static onModuleBinded(
    container: ModuleContainer,
    metadata: ModuleMetadata,
    Module: Newable
  ) {
    inversifySugarOptions.onModuleBinded?.(container, metadata, Module);

    if (inversifySugarOptions.debug) {
      console.log(messagesMap.moduleProvidersBinded(Module.name));
    }
  }

  static setOnModuleBinded(
    value: (
      container: ModuleContainer,
      metadata: ModuleMetadata,
      Module: Newable
    ) => void
  ) {
    inversifySugarOptions.onModuleBinded = value;
  }
}

InversifySugar.globalContainer.applyMiddleware(loggerMiddleware);
