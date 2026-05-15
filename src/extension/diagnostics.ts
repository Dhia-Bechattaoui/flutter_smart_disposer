import * as vscode from 'vscode';
import { DartAnalyzer } from '../core/analyzer';

export class DiagnosticProvider {
    private readonly analyzer = new DartAnalyzer();
    private readonly diagnosticCollection = vscode.languages.createDiagnosticCollection('flutter-smart-disposer');
    private debounceTimer: NodeJS.Timeout | undefined;
    private outputChannel: vscode.OutputChannel | undefined;

    /**
     * Activates the diagnostic provider.
     */
    public activate(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
        this.outputChannel = outputChannel;
        context.subscriptions.push(this.diagnosticCollection);

        // Listen for document events
        context.subscriptions.push(
            vscode.workspace.onDidOpenTextDocument((doc) => this.refreshDiagnostics(doc)),
            vscode.workspace.onDidChangeTextDocument((event) => this.debounceRefresh(event.document)),
            vscode.workspace.onDidCloseTextDocument((doc) => this.diagnosticCollection.delete(doc.uri))
        );

        // Initial scan for all open Dart files
        vscode.workspace.textDocuments.forEach((doc) => this.refreshDiagnostics(doc));
    }

    /**
     * Debounces the diagnostic refresh to avoid excessive analysis.
     */
    private debounceRefresh(document: vscode.TextDocument) {
        if (document.languageId !== 'dart') return;

        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            this.refreshDiagnostics(document);
        }, 500); // 500ms debounce
    }

    /**
     * Performs analysis and updates diagnostics for a document.
     */
    private refreshDiagnostics(document: vscode.TextDocument) {
        if (document.languageId !== 'dart') return;

        try {
            const text = document.getText();
            const result = this.analyzer.analyze(text);
            const diagnostics: vscode.Diagnostic[] = [];

            for (const stateClass of result.stateClasses) {
                for (const variable of stateClass.variables) {
                    if (!variable.isDisposed) {
                        // Create a diagnostic for the undisposed variable
                        // Line number is 1-based in analyzer, 0-based in VS Code
                        const range = document.lineAt(variable.line - 1).range;
                        const diagnostic = new vscode.Diagnostic(
                            range,
                            `Undisposed ${variable.type}: '${variable.name}' should be disposed in the dispose() method.`,
                            vscode.DiagnosticSeverity.Warning
                        );
                        diagnostic.code = 'undisposed_variable';
                        diagnostic.source = 'Flutter Smart Disposer';
                        diagnostics.push(diagnostic);
                    }
                }
            }

            this.diagnosticCollection.set(document.uri, diagnostics);
        } catch (error) {
            this.outputChannel?.appendLine(`Error refreshing diagnostics: ${error}`);
        }
    }
}
