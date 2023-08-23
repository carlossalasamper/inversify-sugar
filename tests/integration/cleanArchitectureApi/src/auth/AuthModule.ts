import { module } from "../../../../../src";
import { IControllerToken } from "../common/IController";
import { UserModule } from "../user/UserModule";
import { AuthController } from "./AuthController";
import { AuthService } from "./AuthService";

@module({
  imports: [UserModule],
  providers: [
    AuthService,
    {
      provide: IControllerToken,
      useClass: AuthController,
    },
  ],
  exports: [{ provide: IControllerToken }],
})
export class AuthModule {}
