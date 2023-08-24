import { module } from "../../../../../src";
import { IControllerToken } from "../common/IController";
import { IUserRepositoryToken } from "./IUserRepository";
import { UserController } from "./UserController";
import { UserRepository } from "./UserRepository";

@module({
  providers: [
    {
      provide: IUserRepositoryToken,
      useClass: UserRepository,
    },
    {
      provide: IControllerToken,
      useClass: UserController,
    },
  ],
  exports: [IUserRepositoryToken, IControllerToken],
})
export class UserModule {}
