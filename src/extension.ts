// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { lineage } from './sqlLineager';
import { TableLineage } from './lineager/tableLineage';
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
				// 获取光标所在位置的标识符的范围
				const wordRange = document.getWordRangeAtPosition(position);
				// 获取光标所在位置的标识符
				if (wordRange) {
					const currentWord = document.getText(wordRange);
					// 计算光标在整个文本中的下标
					const offset = document.offsetAt(position);

					const currentSql = extractCurrentSql(text, offset);
					if (currentSql) {
						// 同时显示SQL和光标位置
						vscode.window.showInformationMessage(`Position: ${offset}, SQL: ${currentSql}`);
					} else {
						vscode.window.showInformationMessage(`No SQL found at position: ${offset}`);
					}
				} else {
					vscode.window.showInformationMessage(`No word found at position: ${position.line}:${position.character}`);
				}

			}
		}
	});

	// 注册 hover provider
	const hoverProvider = vscode.languages.registerHoverProvider('sql', {
		provideHover(document: vscode.TextDocument, position: vscode.Position) {
			const range = document.getWordRangeAtPosition(position, /\b((\w+)\.)?(\w+)\b/);

			if (range) {
				const word = document.getText(range);
				const parts = word.split('.');

				let content = new vscode.MarkdownString();

				if (parts.length === 2) {
					content.appendMarkdown(`**表名**: ${parts[0]}\n\n`);
					content.appendMarkdown(`**字段名**: ${parts[1]}`);
				} else {
					content.appendMarkdown(`**标识符**: ${word}`);
				}

				return new vscode.Hover(content);
			}

			return null;
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(showSqlDisposable);
	context.subscriptions.push(hoverProvider);
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
    let dynamicSQL=false;
	// 检查是否为动态SQL
	const dynamicSqlMatch = (sql + ";").match(/EXECUTE\s+IMMEDIATE\s+'([^;]+)'\s*;/i);
	if (dynamicSqlMatch) {
		dynamicSQL = true;
	}


	// 如果是空的，返回null
	if (!sql) {
		console.log(`No sql extracted.`);
		return '';
	}
	// 输出提取的SQL语句到DEBUG CONSOLE
	console.log(`Extracted SQL: \n${sql}`);

	let table_lineages = lineage(sql, {
		language: 'plsql', 
		dynamicSQL: dynamicSQL,
	});
	console.log(`table_lineages: \n${JSON.stringify(table_lineages)}`);

	return sql;
}

// This method is called when your extension is deactivated
export function deactivate() { }
