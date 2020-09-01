import { TextEditor, Position, Range, Selection } from "vscode";

class EditorHelper {
  /**
   * This function is used to set the current document text
   * @param newText
   */
  public setText = (editor: TextEditor, newText: string) => {
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

  /**
   * Remove whitespace
   * @param text
   */
  public removeWhiteSpace(text: string): string {
    return text.trim().replace(/(?:^[\n\t\r]|[\n\t\r]$)/g, "");
  }
}

export default EditorHelper;
