/* eslint-disable @typescript-eslint/no-explicit-any */

import { interfaces } from "inversify";

export interface DetailedExportedProvider<T = any> {
  provide: interfaces.ServiceIdentifier<T>;
  multiple?: boolean;
  deep?: boolean;
  prototype?: never;
}

export type TokenExportedProvider<T = any> = interfaces.ServiceIdentifier<T>;

type ExportedProvider<T = any> =
  | TokenExportedProvider<T>
  | DetailedExportedProvider<T>;

export default ExportedProvider;
