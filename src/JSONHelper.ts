import * as JsonBigint from "json-bigint";
import * as jsonic from "jsonic";

export interface FixOptions {
  indentation: string | number | undefined;
}

export interface FixResult {
  status: string;
  text?: string;
  error?: any;
}

export enum FixStatus {
  success = "ok",
  failure = "error",
}

enum Error {
  syntaxError = "SyntaxError",
}
class Helper {
  /**
   * isValid
   * @param text
   */
  public isValid(text: string): boolean {
    try {
      return typeof JsonBigint.parse(text) === "object";
    } catch (e) {
      return false;
    }
  }

  /**
   * escape
   * @param text
   */
  public escape(text: string): string {
    return this.isValid(text)
      ? JSON.stringify(text).replace(/^"/g, "").replace(/"$/g, "")
      : text;
  }

  /**
   * unescape
   * @param text
   */
  public unescape(text: string): string {
    let formattedText = text;
    try {
      if (!text.startsWith('"')) {
        formattedText = '"'.concat(formattedText);
      }

      if (!text.endsWith('"')) {
        formattedText = formattedText.concat('"');
      }

      return JSON.parse(formattedText);
    } catch (err) {
      return text;
    }
  }

  /**
   * beautify
   * @param text
   * @param tabSize
   */
  public beautify(text: string, tabSize?: number | string): string {
    return this.isValid(text)
      ? JSON.stringify(JSON.parse(text), null, tabSize)
      : text;
  }

  /**
   * uglify
   * @param text
   */
  public uglify(text: string): string {
    return this.isValid(text)
      ? JSON.stringify(JSON.parse(text), null, 0)
      : text;
  }

  /**
   * fix
   * @param text
   * @param options
   */
  public fixText(text: string, options: FixOptions): FixResult {
    try {
      return {
        status: FixStatus.success,
        text: JSON.stringify(jsonic(text), null, options.indentation),
      };
    } catch (e) {
      let result = { status: FixStatus.failure, error: { message: e.message } };
      if (e.name === Error.syntaxError) {
        result.error = Object.assign({}, result.error, {
          line: e.line,
          column: e.column,
          foundLength: e.found.length,
          message: `(${e.line}, ${e.column}) ${result.error.message}`,
        });
      }
      return result;
    }
  }
}

export default Helper;
