/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces } from "inversify";
import InversifySugar from "./InversifySugar";

export default function setScope(
  binding: interfaces.BindingInWhenOnSyntax<any>,
  scope: interfaces.BindingScope = InversifySugar.defaultScope
) {
  switch (scope) {
    case "Transient":
      binding.inTransientScope();
      break;
    case "Request":
      binding.inRequestScope();
      break;
    case "Singleton":
      binding.inSingletonScope();
      break;
  }
}
