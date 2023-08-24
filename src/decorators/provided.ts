import { tagged } from "inversify";
import { PROVIDED_TAG } from "../utils/constants";

const provided = tagged(PROVIDED_TAG, true);
export default provided;
