import { Container } from "inversify";
import { Provider } from "../../types";
import isNewable from "../validation/isNewable";
import setScope from "./setScope";
import isClassProvider from "../validation/isClassProvider";
import {
  AsyncFactoryProvider,
  ClassProvider,
  FactoryProvider,
  NewableProvider,
  ValueProvider,
} from "../../types/Provider";
import isAsyncFactoryProvider from "../validation/isAsyncFactoryProvider";
import isFactoryProvider from "../validation/isFactoryProvider";
import isValueProvider from "../validation/isValueProvider";
import { PROVIDED_TAG } from "../constants";
import inversifySugarOptions from "../inversifySugarOptions";

export const bindProviderToContainer = (
  provider: Provider,
  container: Container
) => {
  if (isNewable(provider)) {
    const newableProvider = provider as NewableProvider;
    const scope = inversifySugarOptions.defaultScope;

    setScope(container.bind(newableProvider).toSelf(), scope).whenTargetTagged(
      PROVIDED_TAG,
      true
    );
  } else if (isClassProvider(provider)) {
    const classProvider = provider as ClassProvider;
    const scope = classProvider.scope || inversifySugarOptions.defaultScope;
    const bindingOnSyntax = setScope(
      classProvider.provide
        ? container.bind(classProvider.provide).to(classProvider.useClass)
        : container.bind(classProvider.useClass).toSelf(),
      scope
    ).whenTargetTagged(PROVIDED_TAG, true);

    classProvider.onActivation &&
      bindingOnSyntax.onActivation(classProvider.onActivation);

    scope === "Singleton" &&
      classProvider.onDeactivation &&
      bindingOnSyntax.onDeactivation(classProvider.onDeactivation);
  } else if (isValueProvider(provider)) {
    const valueProvider = provider as ValueProvider;
    const bindingOnSyntax = container
      .bind(valueProvider.provide)
      .toConstantValue(valueProvider.useValue)
      .whenTargetTagged(PROVIDED_TAG, true);

    valueProvider.onActivation &&
      bindingOnSyntax.onActivation(valueProvider.onActivation);

    valueProvider.onDeactivation &&
      bindingOnSyntax.onDeactivation(valueProvider.onDeactivation);
  } else if (isFactoryProvider(provider)) {
    const factoryProvider = provider as FactoryProvider;
    const bindingOnSyntax = container
      .bind(factoryProvider.provide)
      .toFactory(factoryProvider.useFactory)
      .whenTargetTagged(PROVIDED_TAG, true);

    factoryProvider.onActivation &&
      bindingOnSyntax.onActivation(factoryProvider.onActivation);

    factoryProvider.onDeactivation &&
      bindingOnSyntax.onDeactivation(factoryProvider.onDeactivation);
  } else if (isAsyncFactoryProvider(provider)) {
    const asyncFactoryProvider = provider as AsyncFactoryProvider;
    const bindingOnSyntax = container
      .bind(asyncFactoryProvider.provide)
      .toProvider(asyncFactoryProvider.useAsyncFactory)
      .whenTargetTagged(PROVIDED_TAG, true);

    asyncFactoryProvider.onActivation &&
      bindingOnSyntax.onActivation(asyncFactoryProvider.onActivation);

    asyncFactoryProvider.onDeactivation &&
      bindingOnSyntax.onDeactivation(asyncFactoryProvider.onDeactivation);
  }
};
