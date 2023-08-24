import { inject, injectable } from "inversify";
import { IController } from "../common/IController";
import { IUserRepository, IUserRepositoryToken } from "../user/IUserRepository";
import provided from "../../../../../src/decorators/provided";

@injectable()
export class UserController implements IController {
  constructor(
    @inject(IUserRepositoryToken)
    @provided
    public readonly userRepository: IUserRepository
  ) {}
}
