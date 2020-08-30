// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, ExtensionContext, commands } from "vscode";
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
  let validateJson = commands.registerCommand("extension.validateJson", () => {
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    let doc = editor.document;
    let text = doc.getText(editor.selection) || doc.getText();

    // Remove trailing and leading whitespace
    let trimmedText = text.trim().replace(/(?:^[\n\t\r]|[\n\t\r]$)/g, "");
    helper.isValid(trimmedText)
      ? window.showInformationMessage("Valid JSON")
      : window.showErrorMessage("Invalid JSON");
  });

  context.subscriptions.push(validateJson);
}

// this method is called when your extension is deactivated
export function deactivate() {}
