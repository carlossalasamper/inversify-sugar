import { Container, interfaces } from "inversify";
import { IMPORTED_TAG, PROVIDED_TAG } from "./constants";
import { Provider } from "../types";
import InversifySugar from "./InversifySugar";
import { bindProviderToContainer } from "./binding/bindProviderToContainer";
import ExportedProviderRef from "../types/ExportedProviderRef";
import bindExportedProviderRef from "./binding/bindExportedProviderRefToContainer";

/**
 * @description Wrapper for inversify container to handle provided and imported concerns
 */
export default class ModuleContainer {
  private container: Container;

  constructor() {
    this.container = InversifySugar.globalContainer.createChild();
  }

  isProvided(serviceIdentifier: interfaces.ServiceIdentifier) {
    return this.container.isBoundTagged(serviceIdentifier, PROVIDED_TAG, true);
  }

  isImported(serviceIdentifier: interfaces.ServiceIdentifier) {
    return this.container.isBoundTagged(serviceIdentifier, IMPORTED_TAG, true);
  }

  bindProvider(provider: Provider) {
    bindProviderToContainer(provider, this.container);
  }

  bindExportedProviderRef(exportedProviderRef: ExportedProviderRef) {
    bindExportedProviderRef(exportedProviderRef, this.container);
  }

  getProvided<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
    return this.container.getTagged<T>(serviceIdentifier, PROVIDED_TAG, true);
  }

  getAllProvided<T = unknown>(
    serviceIdentifier: interfaces.ServiceIdentifier<T>
  ) {
    return this.container.getAllTagged<T>(
      serviceIdentifier,
      PROVIDED_TAG,
      true
    );
  }

  getImported<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
    return this.container.getTagged<T>(serviceIdentifier, IMPORTED_TAG, true);
  }

  getAllImported<T = unknown>(
    serviceIdentifier: interfaces.ServiceIdentifier<T>
  ) {
    return this.container.getAllTagged<T>(
      serviceIdentifier,
      IMPORTED_TAG,
      true
    );
  }

  unbindAll() {
    this.container.unbindAll();
  }
}
