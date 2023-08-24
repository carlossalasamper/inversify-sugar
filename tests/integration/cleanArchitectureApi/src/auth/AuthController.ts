import { inject, injectable } from "inversify";
import { AuthService } from "./AuthService";
import { IController } from "../common/IController";
import { IUserRepository, IUserRepositoryToken } from "../user/IUserRepository";
import provided from "../../../../../src/decorators/provided";
import imported from "../../../../../src/decorators/imported";

@injectable()
export class AuthController implements IController {
  constructor(
    @inject(AuthService) @provided public readonly authService: AuthService,
    @inject(IUserRepositoryToken)
    @imported
    public readonly userRepository: IUserRepository
  ) {}
}
