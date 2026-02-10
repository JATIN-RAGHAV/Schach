import Database from "./database";
import Memory from "./memory";

export default class Data extends Memory(Database(class {})){};
