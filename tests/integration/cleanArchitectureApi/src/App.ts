import { inject, injectable } from "inversify";
import { IController, IControllerToken } from "./common/IController";

@injectable()
export class App {
  constructor(
    @inject(IControllerToken)
    public readonly controllers: IController[]
  ) {}
}
