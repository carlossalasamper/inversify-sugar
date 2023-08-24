import { module } from "../../../../src";
import { App } from "./App";
import { AuthModule } from "./auth/AuthModule";
import { UserModule } from "./user/UserModule";

@module({
  imports: [AuthModule, UserModule],
  providers: [App],
})
export class AppModule {}
