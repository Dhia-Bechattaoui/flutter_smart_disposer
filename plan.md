# Project Plan: Flutter Smart Disposer

## 🎯 Vision
A VS Code extension that provides real-time linting and automated quick-fixes for undisposed objects in Flutter (like `TextEditingController`, `ScrollController`, `AnimationController`, and `StreamSubscription`). Memory leaks from undisposed controllers are the #1 architectural bug in Flutter, and this tool solves it instantly.

## 🚀 Key Features
1. **Real-time Detection:** Analyzes Dart code to find instantiations of known disposable objects.
2. **Lifecycle Verification:** Verifies if the object is properly disposed of in the `dispose()` method of a `State` class.
3. **Visual Warnings:** Adds inline diagnostics (squiggles/warnings) when an object is not disposed.
4. **Quick Fixes:** Provides a one-click Code Action to automatically inject the `object.dispose();` call.

## 🗺️ Implementation Phases

### Phase 1: Project Setup & Foundation
- Initialize the VS Code extension project using `yo code`.
- Set up TypeScript, ESLint, and basic extension structure.
- Define activation events for Dart files (`onLanguage:dart`).

### Phase 2: Code Analysis Engine
- Implement a parser to read the active text document.
- Identify `StatefulWidget` states and track variable declarations of types like `*Controller` or `*Subscription`.
- Identify the presence and contents of the `dispose()` method.

### Phase 3: Diagnostics (Linting)
- Map undisposed variables to their document positions.
- Provide VS Code `Diagnostic` objects to highlight the variable declarations.

### Phase 4: Code Actions (Quick Fixes)
- Implement a `CodeActionProvider`.
- Generate accurate text edits to either:
  - Add the `dispose()` method if it doesn't exist.
  - Insert the `variable.dispose();` call into an existing `dispose()` method.

### Phase 5: Testing & Deployment
- Write unit tests against various Dart file structures.
- Prepare the extension manifest and publish to the VS Code Marketplace.
