import * as vscode from 'vscode';
import { DartAnalyzer } from '../core/analyzer';

export class CodeActionProvider implements vscode.CodeActionProvider {
    private readonly analyzer = new DartAnalyzer();

    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    /**
     * Provides code actions for the given range in the document.
     */
    public provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.CodeAction[] {
        // Only provide actions for our specific diagnostics
        return context.diagnostics
            .filter(diagnostic => diagnostic.code === 'undisposed_variable')
            .map(diagnostic => this.createFix(document, diagnostic));
    }

    /**
     * Creates a quick fix code action for a diagnostic.
     */
    private createFix(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): vscode.CodeAction {
        const fix = new vscode.CodeAction(`Dispose variable`, vscode.CodeActionKind.QuickFix);
        fix.edit = new vscode.WorkspaceEdit();
        fix.diagnostics = [diagnostic];
        fix.isPreferred = true;

        // Extract variable name from diagnostic message (simple approach)
        // message: "Undisposed TextEditingController: '_controller' should be disposed..."
        const match = diagnostic.message.match(/'(\w+)'/);
        if (!match) return fix;
        
        const variableName = match[1];
        const isSubscription = diagnostic.message.includes('StreamSubscription');
        const disposalCall = isSubscription ? `${variableName}.cancel();` : `${variableName}.dispose();`;

        const text = document.getText();
        const result = this.analyzer.analyze(text);

        // Find the class containing this diagnostic
        const stateClass = result.stateClasses.find(sc => 
            diagnostic.range.start.line + 1 >= sc.startLine && 
            diagnostic.range.start.line + 1 <= sc.endLine
        );

        if (!stateClass) return fix;

        if (stateClass.hasDisposeMethod && stateClass.disposeMethodStartLine && stateClass.disposeMethodEndLine) {
            // Case 1: Dispose method exists. Insert before super.dispose() or at the end.
            const disposeRange = new vscode.Range(
                new vscode.Position(stateClass.disposeMethodStartLine - 1, 0),
                new vscode.Position(stateClass.disposeMethodEndLine - 1, 0)
            );
            const disposeText = document.getText(disposeRange);
            const superMatch = disposeText.match(/super\.dispose\(\);/);

            if (superMatch && superMatch.index !== undefined) {
                // Insert before super.dispose()
                const superLine = stateClass.disposeMethodStartLine - 1 + disposeText.substring(0, superMatch.index).split('\n').length - 1;
                const indentation = document.lineAt(superLine).text.match(/^\s*/)?.[0] || '    ';
                fix.edit.insert(document.uri, new vscode.Position(superLine, 0), `${indentation}${disposalCall}\n`);
            } else {
                // Insert before the closing brace of dispose()
                const endLine = stateClass.disposeMethodEndLine - 2; // Line with '}'
                const indentation = '    '; // Default
                fix.edit.insert(document.uri, new vscode.Position(endLine, 0), `${indentation}${disposalCall}\n`);
            }
        } else {
            // Case 2: Dispose method doesn't exist. Create it.
            // Insert after build() method or at the end of class
            const insertionLine = stateClass.endLine - 1;
            const indentation = '  ';
            const newDisposeMethod = `\n${indentation}@override\n${indentation}void dispose() {\n${indentation}  ${disposalCall}\n${indentation}  super.dispose();\n${indentation}}\n`;
            fix.edit.insert(document.uri, new vscode.Position(insertionLine, 0), newDisposeMethod);
        }

        return fix;
    }
}
