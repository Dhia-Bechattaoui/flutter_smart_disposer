import * as vscode from 'vscode';
import { DiagnosticProvider } from './extension/diagnostics';

/**
 * This method is called when your extension is activated.
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "flutter-smart-disposer" is now active!');

    // Initialize Diagnostic Provider (Phase 3)
    const diagnosticProvider = new DiagnosticProvider();
    diagnosticProvider.activate(context);

    // The command has been defined in the package.json file
    let disposable = vscode.commands.registerCommand('flutter-smart-disposer.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from Flutter Smart Disposer!');
    });

    context.subscriptions.push(disposable);
    
    // Log activation to output channel
    const outputChannel = vscode.window.createOutputChannel('Flutter Smart Disposer');
    outputChannel.appendLine('Flutter Smart Disposer is active.');
}

/**
 * This method is called when your extension is deactivated.
 */
export function deactivate() {}
