import { InversifySugarOptions } from "../types";

export const defaultInverseSugarOptions: InversifySugarOptions = {
  debug: false,
  defaultScope: "Transient",
  onModuleBinded: undefined,
};

const inversifySugarOptions: InversifySugarOptions = Object.assign(
  {},
  defaultInverseSugarOptions
);

export default inversifySugarOptions;
