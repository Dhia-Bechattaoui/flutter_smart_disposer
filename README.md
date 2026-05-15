# Flutter Smart Disposer

<p align="center">
  <img src="assets/banner.png" width="600" alt="Flutter Smart Disposer Banner">
</p>


A VS Code extension that automates the detection and disposal of memory-leaking objects in Flutter.

## Overview

Memory leaks from undisposed `TextEditingController`s, `AnimationController`s, and `StreamSubscription`s are a common architectural pitfall in Flutter. Flutter Smart Disposer provides real-time diagnostics and automated quick-fixes to ensure your `StatefulWidget`s stay clean and performant.

## Features

- **Real-time Diagnostics:** Identifies undisposed variables directly within `State` classes.
- **Automated Quick Fixes:** Injects `dispose()` methods or appends missing calls with correct indentation.
- **Broad Type Support:** Handles controllers, focus nodes, timers, and stream subscriptions out of the box.
- **Context Aware:** Respects existing code patterns and conditional disposal (e.g., `_controller?.dispose()`).

## How it Works

The engine parses the active Dart file to identify classes extending `State`. It tracks variable declarations of known disposable types and verifies their disposal within the class lifecycle. If a variable is instantiated but never disposed of, the extension triggers a VS Code Diagnostic warning.

## Development Setup

If you want to build or contribute to the extension:

1. Clone the repository.
2. Run `npm install` to fetch dependencies.
3. Press `F5` in VS Code to launch the extension in a Debug Host.
4. Run `npm run compile` to build the TypeScript source.

## Contributing

Contributions are welcome. Please ensure that new features include relevant tests and follow the existing architecture patterns.

---

Maintainer: [dhia-bechattaoui](https://github.com/dhia-bechattaoui)
