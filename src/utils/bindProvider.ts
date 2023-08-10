/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, interfaces } from "inversify";
import Provider, {
  ClassProvider,
  ConstructorProvider,
  FactoryProvider,
  ValueProvider,
  isClassProvider,
  isConstructorProvider,
  isFactoryProvider,
  isValueProvider,
} from "../types/Provider";
import InversifySugar from "./InversifySugar";

const bindProvider = (provider: Provider, container: Container) => {
  if (isConstructorProvider(provider)) {
    const constructorProvider = provider as ConstructorProvider;

    container.bind(constructorProvider).toSelf().inSingletonScope();
  } else if (isClassProvider(provider)) {
    const classProvider = provider as ClassProvider;
    setScope(
      classProvider.provide
        ? container.bind(classProvider.provide).to(classProvider.useClass)
        : container.bind(classProvider.useClass).toSelf(),
      classProvider.scope
    );
  } else if (isValueProvider(provider)) {
    const valueProvider = provider as ValueProvider;
    container
      .bind(valueProvider.provide)
      .toConstantValue(valueProvider.useValue);
  } else if (isFactoryProvider(provider)) {
    const factoryProvider = provider as FactoryProvider;
    container
      .bind(factoryProvider.provide)
      .toFactory(factoryProvider.useFactory);
  }
};

function setScope(
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

export default bindProvider;
