import { InversifySugarOptions } from "../types";

export const defaultInverseSugarOptions: InversifySugarOptions = {
  debug: true,
  defaultScope: "Transient",
  onModuleImported: undefined,
};

const inversifySugarOptions: InversifySugarOptions = Object.assign(
  {},
  defaultInverseSugarOptions
);

export default inversifySugarOptions;
