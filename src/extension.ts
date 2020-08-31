// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  window,
  ExtensionContext,
  commands,
  TextEditor,
  Position,
  Range,
  Selection,
} from "vscode";
import Helper from "./helper";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  let helper = new Helper();
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "json-utils" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  /**
   * This function is used to set the current document text
   * @param newText
   */
  let setText = (editor: TextEditor, newText: string) => {
    let doc = editor.document;
    editor.edit((builder) => {
      let start, end;

      // Format whole file or selected text
      if (editor.selection.isEmpty) {
        const lastLine = doc.lineAt(doc.lineCount - 1);
        start = new Position(0, 0);
        end = new Position(doc.lineCount - 1, lastLine.text.length);
      } else {
        start = editor.selection.start;
        end = editor.selection.end;
      }

      // replace text
      builder.replace(new Range(start, end), newText);

      // Select the whole json
      editor.selection = new Selection(start, end);
    });
  };

  let removeWhiteSpace = (text: string): string => {
    return text.trim().replace(/(?:^[\n\t\r]|[\n\t\r]$)/g, "");
  };

  /**
   * validateJson
   */
  let validateJson = commands.registerCommand("extension.validateJson", () => {
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    let doc = editor.document;
    let text = doc.getText(editor.selection) || doc.getText();

    // Remove trailing and leading whitespace
    let trimmedText = removeWhiteSpace(text);
    helper.isValid(trimmedText)
      ? window.showInformationMessage("Valid JSON")
      : window.showErrorMessage("Invalid JSON");
  });

  /**
   * escapeJson
   */
  let escapeJson = commands.registerCommand("extension.escapeJson", () => {
    // Get active editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Get the document
    let doc = editor.document;
    let text = doc.getText(editor.selection) || doc.getText();

    // Remove trailing and leading whitespace
    let trimmedText = removeWhiteSpace(text);

    // Escape JSON
    let escapedJson = helper.escape(trimmedText);
    if (escapedJson !== trimmedText) {
      setText(editor, escapedJson);
    }
  });

  /**
   * unescapeJson
   */
  let unescapeJson = commands.registerCommand("extension.unescapeJson", () => {
    // Get active editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Get the document
    let doc = editor.document;
    let text = doc.getText(editor.selection) || doc.getText();

    // Remove trailing and leading whitespace
    let trimmedText = removeWhiteSpace(text);

    // Unescape JSON
    let unescapedJson = helper.unescape(trimmedText);

    if (unescapedJson !== trimmedText) {
      setText(editor, unescapedJson);
    }
  });

  context.subscriptions.push(validateJson);
  context.subscriptions.push(escapeJson);
  context.subscriptions.push(unescapeJson);
}

// this method is called when your extension is deactivated
export function deactivate() {}
