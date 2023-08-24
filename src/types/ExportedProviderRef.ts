/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces } from "inversify";

export default interface ExportedProviderRef<T = any> {
  provide: interfaces.ServiceIdentifier<T>;
  multiple: boolean;
  getValue: () => T;
}
