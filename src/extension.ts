import * as vscode from 'vscode';

/**
 * This method is called when your extension is activated.
 * Your extension is activated the very first time the command is executed.
 */
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "flutter-smart-disposer" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('flutter-smart-disposer.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from Flutter Smart Disposer!');
    });

    context.subscriptions.push(disposable);
    
    // Log activation to output channel as per core-architecture rules
    const outputChannel = vscode.window.createOutputChannel('Flutter Smart Disposer');
    outputChannel.appendLine('Flutter Smart Disposer is active.');
}

/**
 * This method is called when your extension is deactivated.
 */
export function deactivate() {}
