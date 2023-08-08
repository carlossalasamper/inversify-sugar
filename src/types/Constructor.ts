/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @descriptin This type represents a constructor function.
 */
type Constructor<T = any> = new (...args: any[]) => T;

export default Constructor;
