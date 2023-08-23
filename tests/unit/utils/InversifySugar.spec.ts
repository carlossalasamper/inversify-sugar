import { inject, injectable } from "inversify";
import {
  Newable,
  InversifySugar,
  getModuleContainer,
  module,
} from "../../../src";
import messagesMap from "../../../src/utils/messagesMap";
import inversifySugarOptions from "../../../src/utils/inversifySugarOptions";

@module({})
class ModuleA {}
@module({})
class ModuleB {}

const appModuleImports: Newable[] = [ModuleA, ModuleB];

@module({
  imports: appModuleImports,
})
class AppModule {}

describe("InversifySugar", () => {
  const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
  const inversifySugarOnModuleImported = jest.spyOn(
    InversifySugar,
    "onModuleImported"
  );
  const onModuleImported = jest.fn();

  beforeEach(() => {
    InversifySugar.reset();
    InversifySugar.setOnModuleImported(onModuleImported);
    inversifySugarOptions.debug = true;
  });

  it("InversifySugar.run should be called once.", () => {
    InversifySugar.run(AppModule);
    expect(() => InversifySugar.run(AppModule)).toThrow(
      messagesMap.alreadyRunning
    );
  });

  it("InversifySugar.onModuleImported should be called once per imported module.", () => {
    expect(inversifySugarOnModuleImported).toHaveBeenCalledTimes(
      appModuleImports.length
    );
    expect(onModuleImported).toHaveBeenCalledTimes(appModuleImports.length);
  });

  it("Should print a message for each imported module.", () => {
    for (const importedModule of appModuleImports) {
      expect(consoleLogMock).toHaveBeenCalledWith(
        messagesMap.moduleProvidersBinded(importedModule.name)
      );
    }
  });

  it("Should reset InversifySugar even if its nto running", () => {
    InversifySugar.reset();
    expect(() => InversifySugar.run(AppModule)).not.toThrow();
  });

  it("Should resolve all dependencies in a complicated escenary", () => {
    const IUserRepositoryToken = Symbol("IUserRepository");
    @injectable()
    class UserRepository {}

    @injectable()
    class AuthUseCase {
      constructor(
        @inject(IUserRepositoryToken)
        public readonly userRepository: UserRepository
      ) {}
    }
    @injectable()
    class AuthService {
      constructor(
        @inject(AuthUseCase)
        public readonly useCase: AuthUseCase
      ) {}
    }

    @module({
      providers: [{ useClass: UserRepository, provide: IUserRepositoryToken }],
      exports: [IUserRepositoryToken],
    })
    class UserModule {}

    @module({
      imports: [UserModule],
      providers: [AuthService, AuthUseCase],
      exports: [AuthService],
    })
    class AuthModule {}

    @module({
      imports: [AuthModule, UserModule],
    })
    class AppModule {}

    InversifySugar.run(AppModule);

    const container = getModuleContainer(AppModule);

    expect(container.get(AuthService)).toBeInstanceOf(AuthService);
  });
});
