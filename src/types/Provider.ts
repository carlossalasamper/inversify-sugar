/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces } from "inversify";
import { z } from "zod";
import { Constructor } from ".";

const ProvideSchema = z.string().or(z.symbol());
const ScopeSchema = z.enum(["Singleton", "Request", "Transient"]);

const ConstructorProviderSchema = z.function();

const ClassProviderSchema = z.object({
  provide: ProvideSchema.optional(),
  useClass: z.function(),
  scope: ScopeSchema.optional(),
});

const ValueProviderSchema = z.object({
  provide: ProvideSchema,
  useValue: z.any(),
});

const FactoryProviderSchema = z.object({
  provide: ProvideSchema,
  useFactory: z.function(),
});

interface WithProvide {
  /**
   * @description ServiceIdentifier / InjectionToken
   */
  provide: interfaces.ServiceIdentifier;
}

/**
 * Shorthand to define a *Class* provider to self in singleton scope.
 */
export type ConstructorProvider<T = any> = Constructor<T>;

/**
 * @description Interface defining a *Class* type provider.
 */
export interface ClassProvider<T = any> extends Partial<WithProvide> {
  /**
   * @description Instance of a provider to be injected.
   */
  useClass: T;
  useValue?: never;
  /**
   * Binding scope of a provider.
   * @default 'Singleton'
   */
  scope?: interfaces.BindingScope;
}

/**
 * @description Interface defining a *Value* type provider.
 */
export interface ValueProvider<T = any> extends WithProvide {
  /**
   * @description Instance of a provider to be injected.
   */
  useValue: T;
  useClass?: never;
}

/**
 * @description Interface defining a *Factory* type provider. The scope of a factory provider is always singleton.
 */
export interface FactoryProvider<T = any> extends WithProvide {
  /**
   * @description Factory function to be injected.
   */
  useFactory: (context: interfaces.Context) => (...args: any[]) => T;
  useValue?: never;
  useClass?: never;
}

type Provider<T = any> =
  | ConstructorProvider<T>
  | ClassProvider<T>
  | ValueProvider<T>
  | FactoryProvider<T>;

export default Provider;

export const isConstructorProvider = (data: unknown) => {
  return ConstructorProviderSchema.safeParse(data).success;
};
export const isClassProvider = (data: unknown) => {
  return ClassProviderSchema.safeParse(data).success;
};
export const isValueProvider = (data: unknown) => {
  return ValueProviderSchema.safeParse(data).success;
};
export const isFactoryProvider = (data: unknown) => {
  return FactoryProviderSchema.safeParse(data).success;
};
