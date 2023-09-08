/* eslint-disable @typescript-eslint/no-explicit-any */
export default function getAllMetadata<T>(target: object, keys: string[]): T {
  return keys.reduce((acc, key) => {
    acc[key] = Reflect.getMetadata(key, target);
    return acc;
  }, {} as any) as T;
}
