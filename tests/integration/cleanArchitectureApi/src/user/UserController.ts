import { inject, injectable } from "inversify";
import { IController } from "../common/IController";
import { IUserRepository, IUserRepositoryToken } from "../user/IUserRepository";

@injectable()
export class UserController implements IController {
  constructor(
    @inject(IUserRepositoryToken)
    public readonly userRepository: IUserRepository
  ) {}
}
