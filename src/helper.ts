import * as JsonBigint from "json-bigint";

class Helper {
  public isValid(text: string): boolean {
    try {
      return typeof JsonBigint.parse(text) === "object";
    } catch (e) {
      return false;
    }
  }
}

export default Helper;
