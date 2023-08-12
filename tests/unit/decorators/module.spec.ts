import { module } from "../../../src";
import ModuleMetadata, {
  moduleMetadataKeys,
} from "../../../src/types/ModuleMetadata";
import getAllMetadata from "../../../src/utils/getAllMetadata";
import { Container } from "inversify";

@module({})
class EmptyMetadataModule {}

describe("@module", () => {
  const emptyContainer = new Container();

  it("Should generate correct metadata from empty args.", () => {
    const metadata = getAllMetadata<ModuleMetadata>(
      EmptyMetadataModule.prototype,
      moduleMetadataKeys
    );

    expect(metadata).toMatchObject<Omit<ModuleMetadata, "container">>({
      isModule: true,
      isBinded: false,
      imports: [],
      providers: [],
      exports: [],
    });

    expect(metadata.container).toBeInstanceOf(Container);
    expect({ ...metadata.container, id: emptyContainer.id }).toMatchObject(
      emptyContainer
    );
  });
});
