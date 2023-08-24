/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces } from "inversify";
import inversifySugarOptions from "./inversifySugarOptions";

export default function setScope(
  binding: interfaces.BindingInWhenOnSyntax<any>,
  scope: interfaces.BindingScope = inversifySugarOptions.defaultScope
) {
  const scopeMethodKeys: Record<
    interfaces.BindingScope,
    keyof interfaces.BindingInSyntax<any>
  > = {
    Transient: "inTransientScope",
    Request: "inRequestScope",
    Singleton: "inSingletonScope",
  };

  return binding[scopeMethodKeys[scope]]();
}
