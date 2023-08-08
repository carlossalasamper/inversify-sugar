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

/**
 * Shorthand to define a *Class* provider to self in singleton scope.
 */
export type ConstructorProvider<T = any> = Constructor<T>;

/**
 * Interface defining a *Class* type provider.
 *
 * For example:
 * ```typescript
 * const connectionProvider = {
 *   provide: Symbol('ISomeClass'),
 *   useClass: SomeClass,
 * };
 * ```
 *
 * @publicApi
 */
export interface ClassProvider<T = any> {
  /**
   * Injection token
   */
  provide?: interfaces.ServiceIdentifier;
  /**
   * Instance of a provider to be injected.
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
 * Interface defining a *Value* type provider.
 *
 * For example:
 * ```typescript
 * const connectionProvider = {
 *   provide: 'CONNECTION',
 *   useValue: connection,
 * };
 * ```
 *
 * @publicApi
 */
export interface ValueProvider<T = any> {
  /**
   * Injection token
   */
  provide: interfaces.ServiceIdentifier;
  /**
   * Instance of a provider to be injected.
   */
  useValue: T;
  useClass?: never;
}

type Provider<T = any> =
  | ConstructorProvider<T>
  | ClassProvider<T>
  | ValueProvider<T>;

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
