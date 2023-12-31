/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces } from "inversify";

export default function setScope(
  binding: interfaces.BindingInWhenOnSyntax<any>,
  scope: interfaces.BindingScope
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
