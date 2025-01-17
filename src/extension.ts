// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('"zyloh-sql-formatter" is now active!');

	// Register SQL formatter command
	let disposable = vscode.commands.registerCommand('zyloh-sql-formatter.format', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			if (document.languageId === 'sql') {
				// Add your SQL formatting logic here
				vscode.window.showInformationMessage('SQL formatting triggered!');
			}
		}
	});

	// Register SQL show command
	let showSqlDisposable = vscode.commands.registerCommand('zyloh-sql-formatter.showCurrentSql', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			if (document.languageId === 'sql') {
				const position = editor.selection.active;
				const text = document.getText();
				
				// 计算光标在整个文本中的下标
				const offset = document.offsetAt(position);
				
				const currentSql = extractCurrentSql(text, offset);
				if (currentSql) {
					// 同时显示SQL和光标位置
					vscode.window.showInformationMessage(`Position: ${offset}, SQL: ${currentSql}`);
				}else {
					vscode.window.showInformationMessage(`No SQL found at position: ${offset}`);
				}
				
			}
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(showSqlDisposable);
}

function extractCurrentSql(text: string, cursorPosition: number): string {
	// 分隔符是分号
	const delimiters = /;/g;
	let match;
	let startPos = 0;
	let endPos = text.length;
	
	// 查找光标所在的SQL语句
	while ((match = delimiters.exec(text)) !== null) {
		if (match.index >= cursorPosition) {
			endPos = match.index;
			break;
		}
		startPos = match.index + 1;
	}
	
	// 提取并清理SQL语句
	let sql = text.substring(startPos, endPos).trim();
	
	// 如果是空的，返回null
	if (!sql) {
		return '';
	}
	
	return sql;
}

// This method is called when your extension is deactivated
export function deactivate() {}
