import ExportedProvider from "./ExportedProvider";
import Newable from "./Newable";
import Provider from "./Provider";

export type NewableModule = Newable;

export interface DynamicModule {
  module: Newable;
  providers: Provider[];
  exports?: ExportedProvider[];
}

type Module = NewableModule | DynamicModule;

export default Module;
