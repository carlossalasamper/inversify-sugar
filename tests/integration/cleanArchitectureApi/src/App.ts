import { inject, injectable } from "inversify";
import { IController, IControllerToken } from "./common/IController";
import imported from "../../../../src/decorators/imported";

@injectable()
export class App {
  constructor(
    @inject(IControllerToken)
    @imported
    public readonly controllers: IController[]
  ) {}
}
