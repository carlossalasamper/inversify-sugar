import { tagged } from "inversify";
import { IMPORTED_TAG } from "../utils/constants";

const imported = tagged(IMPORTED_TAG, true);
export default imported;
