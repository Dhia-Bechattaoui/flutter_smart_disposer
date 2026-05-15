import { AnalysisResult, StateClass, DisposableVariable } from './types';

export class DartAnalyzer {
    private static readonly DISPOSABLE_TYPES = [
        'TextEditingController',
        'AnimationController',
        'ScrollController',
        'TabController',
        'StreamSubscription',
        'FocusNode',
        'Timer',
        'ChangeNotifier'
    ];

    /**
     * Analyzes Dart code to find undisposed variables in State classes.
     */
    public analyze(text: string): AnalysisResult {
        const lines = text.split(/\r?\n/);
        const stateClasses: StateClass[] = [];
        let currentClass: StateClass | null = null;

        const disposableTypesPattern = DartAnalyzer.DISPOSABLE_TYPES.join('|');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNumber = i + 1;

            if (line.length === 0) continue;

            // Detect State class start - be more flexible with whitespace and generics
            const classMatch = line.match(/class\s+(\w+)\s+extends\s+State\s*<[^>]+>/);
            if (classMatch) {
                currentClass = {
                    name: classMatch[1],
                    startLine: lineNumber,
                    endLine: lineNumber,
                    variables: [],
                    hasDisposeMethod: false
                };
                stateClasses.push(currentClass);
                continue;
            }

            if (currentClass) {
                // Detect class member variables
                // Pattern 1: Type name; or Type name = ...;
                // Pattern 2: final/late/var name = Type(...);
                const typeNamePattern = new RegExp(`^\\s*(?:late|final|var|static|const|\\s)*(${disposableTypesPattern})\\??\\s+(\\w+)`);
                const inferredPattern = new RegExp(`^\\s*(?:late|final|var|static|const|\\s)+(\\w+)\\s*=\\s*(?:new\\s+)?(${disposableTypesPattern})\\s*\\(`);

                const typeNameMatch = line.match(typeNamePattern);
                const inferredMatch = line.match(inferredPattern);

                if (typeNameMatch) {
                    currentClass.variables.push({
                        type: typeNameMatch[1],
                        name: typeNameMatch[2],
                        line: lineNumber,
                        isDisposed: false
                    });
                } else if (inferredMatch) {
                    currentClass.variables.push({
                        type: inferredMatch[2],
                        name: inferredMatch[1],
                        line: lineNumber,
                        isDisposed: false
                    });
                }

                // Detect dispose method start
                if (line.match(/void\s+dispose\s*\(\s*\)/)) {
                    currentClass.hasDisposeMethod = true;
                    currentClass.disposeMethodStartLine = lineNumber;

                    let braceCount = 0;
                    let foundOpenBrace = false;
                    let j = i;

                    while (j < lines.length) {
                        const disposeLine = lines[j];

                        if (disposeLine.includes('{')) {
                            braceCount += (disposeLine.match(/\{/g) || []).length;
                            foundOpenBrace = true;
                        }
                        if (disposeLine.includes('}')) {
                            braceCount -= (disposeLine.match(/\}/g) || []).length;
                        }

                        // Check if variables are disposed in this method
                        for (const variable of currentClass.variables) {
                            const disposePattern = variable.type === 'StreamSubscription'
                                ? new RegExp(`${variable.name}\\??\\.cancel\\(\\s*\\)`)
                                : new RegExp(`${variable.name}\\??\\.dispose\\(\\s*\\)`);

                            if (disposeLine.match(disposePattern)) {
                                variable.isDisposed = true;
                            }
                        }

                        if (foundOpenBrace && braceCount === 0) {
                            break;
                        }
                        j++;
                    }
                    currentClass.disposeMethodEndLine = j + 1;
                    // We don't skip lines here to allow class end detection if it's on the same line (rare but possible)
                }

                // Detect class end
                if (line === '}' || line.startsWith('}')) {
                    // Check if this is the class end by ensuring we aren't inside a method
                    // For now, simple check: if we found a closing brace at the start of a line and aren't in dispose
                    // In a more complex file, this would need brace counting for the whole class.
                    currentClass.endLine = lineNumber;
                    // Don't null currentClass immediately to allow last line processing if needed
                    // Actually, for simple regex, it's safer to keep going until we hit another class or EOF
                }
            }
        }

        return { stateClasses };
    }
}
