import { inject, injectable } from "inversify";
import { AuthService } from "./AuthService";
import { IController } from "../common/IController";
import { IUserRepository, IUserRepositoryToken } from "../user/IUserRepository";

@injectable()
export class AuthController implements IController {
  constructor(
    @inject(AuthService) public readonly authService: AuthService,
    @inject(IUserRepositoryToken)
    public readonly userRepository: IUserRepository
  ) {}
}
