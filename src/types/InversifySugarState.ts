import { Container } from "inversify";
import Constructor from "./Constructor";

export default interface InversifySugarState {
  isRunning: boolean;
  globalContainer: Container;
  rootModule?: Constructor;
}
