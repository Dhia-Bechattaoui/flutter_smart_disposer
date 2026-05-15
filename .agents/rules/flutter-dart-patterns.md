---
trigger: always_on
---

# Rule: Flutter & Dart Patterns

## 1. Disposable Tracking
The following types are considered "Disposable" by default:
- `TextEditingController`
- `AnimationController`
- `ScrollController`
- `TabController`
- `StreamSubscription`
- `FocusNode`
- `Timer`
- `ChangeNotifier` (if created within the State)

## 2. Context Awareness
- **StatefulWidget Only:** Only track variables instantiated inside the `State` class of a `StatefulWidget`.
- **Initialization Check:** Look for variables initialized in `initState`, as class members, or within the `build` method (though building in `build` is a separate anti-pattern to warn about).

## 3. Disposal Verification
- A variable is considered "Safe" if `.dispose()` or `.cancel()` (for subscriptions) is called within the `dispose()` method of the same class.
- The tool must handle conditional disposal (e.g., `_controller?.dispose()`).

## 4. Code Action Formatting
- When injecting a `dispose()` call, match the indentation of the existing `dispose()` method.
- If the `dispose()` method does not exist, create it after the `build()` method or at the end of the class, including a call to `super.dispose()`.
