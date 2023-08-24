/* eslint-disable @typescript-eslint/no-explicit-any */
import { interfaces } from "inversify";

/**
 * @description This type represents a newable object (a class).
 */
type Newable<T = any> = interfaces.Newable<T>;

export default Newable;
