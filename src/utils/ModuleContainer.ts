import { Container, interfaces } from "inversify";
import { IMPORTED_TAG, PROVIDED_TAG } from "./constants";

/**
 * @description Extension of the Inversify Container to handle the module concerns
 */
export default class ModuleContainer extends Container {
  getProvided<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
    return this.getTagged<T>(serviceIdentifier, PROVIDED_TAG, true);
  }

  getAllProvided<T = unknown>(
    serviceIdentifier: interfaces.ServiceIdentifier<T>
  ) {
    return this.getAllTagged<T>(serviceIdentifier, PROVIDED_TAG, true);
  }

  getImported<T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
    return this.getTagged<T>(serviceIdentifier, IMPORTED_TAG, true);
  }
}
