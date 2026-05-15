import * as vscode from 'vscode';
import { DiagnosticProvider } from './extension/diagnostics';
import { CodeActionProvider } from './extension/code_actions';

/**
 * This method is called when your extension is activated.
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "flutter-smart-disposer" is now active!');

    // Initialize Output Channel (Core Architecture Rule #4)
    const outputChannel = vscode.window.createOutputChannel('Flutter Smart Disposer');
    outputChannel.appendLine('Flutter Smart Disposer is active.');

    // Initialize Diagnostic Provider (Phase 3)
    const diagnosticProvider = new DiagnosticProvider();
    diagnosticProvider.activate(context, outputChannel);

    // Initialize Code Action Provider (Phase 4)
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('dart', new CodeActionProvider(), {
            providedCodeActionKinds: CodeActionProvider.providedCodeActionKinds
        })
    );

}

/**
 * This method is called when your extension is deactivated.
 */
export function deactivate() {}
