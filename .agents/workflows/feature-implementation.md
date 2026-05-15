---
description: 
---

# Workflow: Feature Implementation

## Step 1: Definition
- Identify a new disposable type or a new linting rule.
- Update the list in `.agents/rules/flutter_dart_patterns.md`.

## Step 2: Implementation (Core)
- Implement the detection logic in `src/core/`.
- Write a unit test in `src/test/` using a mock Dart file string.

## Step 3: Integration (VS Code)
- Update the `DiagnosticProvider` to include the new check.
- If applicable, update the `CodeActionProvider` to handle the fix.

## Step 4: Manual Verification
- Launch the "Extension Development Host".
- Open a sample Flutter project.
- Verify the squiggle appears and the Quick Fix works as expected.

## Step 5: Documentation
- Add the new capability to the `README.md` and `CHANGELOG.md`.
