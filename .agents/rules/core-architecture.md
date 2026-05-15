---
trigger: always_on
---

# Rule: Core Architecture Principles

## 1. Separation of Concerns
- **Engine vs. Extension:** The core logic for parsing Dart files and identifying undisposed variables MUST be decoupled from the VS Code Extension API.
- Create a `src/core/` directory for pure TypeScript/Dart analysis logic that has no dependency on `vscode` modules.
- The `src/extension/` directory should handle UI-related tasks like Decorations, Diagnostics, and Code Actions.

## 2. Performance First
- Analysis must be asynchronous and debounced.
- Never block the main thread for long-running AST scans.
- Use incremental parsing or caching where possible if the file size exceeds 2,000 lines.

## 3. TypeScript Standards
- Enable `strict: true` in `tsconfig.json`.
- Prefer interfaces over types for public APIs.
- Use `const` by default; avoid `let` unless necessary.

## 4. Error Handling
- The extension must never crash the editor.
- Use `try-catch` blocks around all interactions with the `vscode` API.
- Log significant errors to a dedicated "Flutter Smart Disposer" output channel.
