/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces } from "inversify";
import { keys } from "ts-transformer-keys";

export const scopeKeys = keys<interfaces.BindingScopeEnum>();

const isValidScope = (data: any) => {
  return scopeKeys.includes(data);
};

export default isValidScope;
