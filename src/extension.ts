// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, ExtensionContext, commands } from "vscode";
import EditorHelper from "./editorHelper";
import JSONHelper from "./JSONHelper";

enum JsonValidationMessage {
  valid = "Valid JSON",
  invalid = "Invalid JSON",
}

enum RegisterCommand {
  validate = "extension.validateJson",
  escape = "extension.escapeJson",
  unescape = "extension.unescapeJson",
  beautify = "extension.beautifyJson",
  uglify = "extension.uglifyJson",
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  let jsonHelper = new JSONHelper();
  let editorHelper = new EditorHelper();
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "json-utils" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  /**
   * validateJson
   */
  let validateJson = commands.registerCommand(RegisterCommand.validate, () => {
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    const { document } = editor;
    let text = document.getText(editor.selection) || document.getText();

    // Remove trailing and leading whitespace
    let trimmedText = editorHelper.removeWhiteSpace(text);
    jsonHelper.isValid(trimmedText)
      ? window.showInformationMessage(JsonValidationMessage.valid)
      : window.showErrorMessage(JsonValidationMessage.invalid);
  });

  /**
   * escapeJson
   */
  let escapeJson = commands.registerCommand(RegisterCommand.escape, () => {
    // Get active editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Get the document
    const { document } = editor;
    let text = document.getText(editor.selection) || document.getText();

    // Remove trailing and leading whitespace
    let trimmedText = editorHelper.removeWhiteSpace(text);

    // Escape JSON
    let escapedJson = jsonHelper.escape(trimmedText);
    if (escapedJson !== trimmedText) {
      editorHelper.setText(editor, escapedJson);
    }
  });

  /**
   * unescapeJson
   */
  let unescapeJson = commands.registerCommand(RegisterCommand.unescape, () => {
    // Get active editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Get the document
    const { document } = editor;
    let text = document.getText(editor.selection) || document.getText();

    // Remove trailing and leading whitespace
    let trimmedText = editorHelper.removeWhiteSpace(text);

    // Unescape JSON
    let unescapedJson = jsonHelper.unescape(trimmedText);

    if (unescapedJson !== trimmedText) {
      editorHelper.setText(editor, unescapedJson);
    }
  });

  /**
   * beautifyJson
   */
  let beautifyJson = commands.registerCommand(RegisterCommand.beautify, () => {
    // Get active editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Get the document
    const { document } = editor;
    let text = document.getText(editor.selection) || document.getText();

    // Remove trailing and leading whitespace
    let trimmedText = editorHelper.removeWhiteSpace(text);

    // Beautify JSON
    let beautifiedJson = jsonHelper.beautify(
      trimmedText,
      editor.options.insertSpaces ? editor.options.tabSize : "\t"
    );
    if (beautifiedJson !== trimmedText) {
      let tabStyle = editor.options.insertSpaces ? " " : "\t";

      if (!editor.selection.isEmpty) {
        let start = editor.selection.start;
        beautifiedJson = beautifiedJson.replace(
          /(\n)/g,
          "$1" + tabStyle.repeat(start.character)
        );
      }
      editorHelper.setText(editor, beautifiedJson);
    }
  });

  /**
   * uglifyJson
   */
  let uglifyJson = commands.registerCommand(RegisterCommand.uglify, () => {
    // Get active editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Get the document
    const { document } = editor;
    let text = document.getText(editor.selection) || document.getText();

    let trimmedText = editorHelper.removeWhiteSpace(text);

    // Uglify JSON
    let uglifiedJson = jsonHelper.uglify(trimmedText);
    if (uglifiedJson !== trimmedText) {
      editorHelper.setText(editor, uglifiedJson);
    }
  });

  context.subscriptions.push(validateJson);
  context.subscriptions.push(escapeJson);
  context.subscriptions.push(unescapeJson);
  context.subscriptions.push(beautifyJson);
  context.subscriptions.push(uglifyJson);
}

// this method is called when your extension is deactivated
export function deactivate() {}
