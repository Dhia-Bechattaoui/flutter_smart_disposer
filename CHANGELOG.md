# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.5] - 2026-05-15

### Added
- Enhanced `DartAnalyzer` with support for complex file structures and multiple classes.
- Improved error handling with dedicated output channel logging (Architectural Rule #4).
- Finalized unit test suite with expanded multi-class validation.
- Improved diagnostic reliability and cleanup.

## [0.0.4] - 2026-05-15

### Added
- Implemented `CodeActionProvider` to provide "Quick Fix" actions for memory leaks.
- Added intelligent injection of disposal calls into existing `dispose()` methods.
- Implemented automatic generation of missing `dispose()` methods with correct boilerplate.
- Added support for context-aware disposal calls (`.dispose()` vs `.cancel()`).
- Registered the Quick Fix provider for the Dart language.

## [0.0.3] - 2026-05-15

### Added
- Implemented `DiagnosticProvider` to show real-time warnings for undisposed variables in VS Code.
- Integrated `DartAnalyzer` with the VS Code `DiagnosticCollection` API.
- Added asynchronous, debounced (500ms) analysis to ensure high performance during editing.
- Implemented automatic diagnostic cleanup on document close.
- Linked diagnostics to the extension activation lifecycle.

## [0.0.2] - 2026-05-15

### Added
- Implemented `DartAnalyzer` core logic for memory leak detection.
- Added support for tracking member variables of common disposable types.
- Implemented detection for both explicit and inferred variable declarations.
- Added disposal verification logic, including support for `.dispose()`, `.cancel()`, and conditional disposal (`?.`).
- Created a comprehensive unit test suite for the analysis engine.
- Added `test:core` script for standalone engine validation.

## [0.0.1] - 2026-05-15

### Added
- Initialized VS Code extension project structure.
- Configured TypeScript with `strict: true` and modern compilation settings.
- Added activation events for `.dart` files (`onLanguage:dart`).
- Implemented basic `extension.ts` with activation logging and hello world command.
- Set up ESLint for code quality and standard enforcement.
- Created `src/core` and `src/extension` directories for clean architecture separation.

[0.0.5]: https://github.com/dhia-bechattaoui/flutter-smart-disposer/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/dhia-bechattaoui/flutter-smart-disposer/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/dhia-bechattaoui/flutter-smart-disposer/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/dhia-bechattaoui/flutter-smart-disposer/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/dhia-bechattaoui/flutter-smart-disposer/releases/tag/v0.0.1
