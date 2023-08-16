/* eslint-disable @typescript-eslint/no-explicit-any */

import { interfaces } from "inversify";

export interface MultiExportedProvider<T = any> {
  provide: interfaces.ServiceIdentifier<T>;
  multi: true;
  prototype?: never;
}

export type SingleExportedProvider<T = any> = interfaces.ServiceIdentifier<T>;

type ExportedProvider<T = any> =
  | SingleExportedProvider<T>
  | MultiExportedProvider<T>;

export default ExportedProvider;
