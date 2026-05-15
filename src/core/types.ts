export interface DisposableVariable {
    name: string;
    type: string;
    line: number;
    isDisposed: boolean;
}

export interface StateClass {
    name: string;
    startLine: number;
    endLine: number;
    variables: DisposableVariable[];
    hasDisposeMethod: boolean;
    disposeMethodStartLine?: number;
    disposeMethodEndLine?: number;
}

export interface AnalysisResult {
    stateClasses: StateClass[];
}
