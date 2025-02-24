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
    
    // 检查是否为动态SQL
    const dynamicSqlMatch = (sql+";").match(/EXECUTE\s+IMMEDIATE\s+'([^;]+)';/i);
    if (dynamicSqlMatch) {
        // 提取动态SQL内容，并处理转义的单引号
        sql = dynamicSqlMatch[1].replace(/''/g, "'");
        
        // 处理变量拼接的情况
        // 这里假设变量拼接使用的是 '+'
        // 例如: '''+p_data_date+'''
        const variablePattern = /'''\s*\+\s*([\w\s]+)\s*\+\s*'''/g;
        let variableMatch;
        while ((variableMatch = variablePattern.exec(sql)) !== null) {
            // 替换变量拼接部分为占位符或其他处理方式
            // 这里简单地替换为 '<variable>'
            sql = sql.replace(variableMatch[0], '<variable>');
        }
    }
    // 输出提取的SQL语句到DEBUG CONSOLE
    console.log(`Extracted SQL: \n${sql}`);

    // 如果是空的，返回null
    if (!sql) {
        console.log(`No sql extracted.`);
        return '';
    }
    
    return sql;
}

// This method is called when your extension is deactivated
export function deactivate() {}
