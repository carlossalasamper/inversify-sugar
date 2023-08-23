import { injectable } from "inversify";
import { IUserRepository } from "./IUserRepository";

@injectable()
export class UserRepository implements IUserRepository {}
