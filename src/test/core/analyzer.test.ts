import * as assert from 'assert';
import { DartAnalyzer } from '../../core/analyzer';

describe('DartAnalyzer', () => {
  const analyzer = new DartAnalyzer();

  it('should detect undisposed TextEditingController', () => {
    const code = `
class _MyWidgetState extends State<MyWidget> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    super.dispose();
  }
}
        `;
    const result = analyzer.analyze(code);
    assert.strictEqual(result.stateClasses.length, 1);
    assert.strictEqual(result.stateClasses[0].variables.length, 1);
    assert.strictEqual(result.stateClasses[0].variables[0].name, '_controller');
    assert.strictEqual(result.stateClasses[0].variables[0].isDisposed, false);
  });

  it('should detect disposed TextEditingController', () => {
    const code = `
class _MyWidgetState extends State<MyWidget> {
  late final TextEditingController _controller;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
        `;
    const result = analyzer.analyze(code);
    assert.strictEqual(result.stateClasses[0].variables[0].isDisposed, true);
  });

  it('should detect undisposed StreamSubscription and suggest cancel()', () => {
    const code = `
class _MyWidgetState extends State<MyWidget> {
  StreamSubscription? _sub;

  @override
  void dispose() {
    super.dispose();
  }
}
        `;
    const result = analyzer.analyze(code);
    assert.strictEqual(result.stateClasses[0].variables[0].isDisposed, false);
  });

  it('should detect disposed StreamSubscription with cancel()', () => {
    const code = `
class _MyWidgetState extends State<MyWidget> {
  StreamSubscription _sub;

  @override
  void dispose() {
    _sub.cancel();
    super.dispose();
  }
}
        `;
    const result = analyzer.analyze(code);
    assert.strictEqual(result.stateClasses[0].variables[0].isDisposed, true);
  });

  it('should handle conditional disposal (variable?.dispose())', () => {
    const code = `
class _MyWidgetState extends State<MyWidget> {
  TextEditingController? _controller;

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }
}
        `;
    const result = analyzer.analyze(code);
    assert.strictEqual(result.stateClasses[0].variables[0].isDisposed, true);
  });
});
