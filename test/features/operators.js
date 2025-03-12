"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsOperators;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsOperators(format, operators, cfg = {}) {
    // Always test for standard SQL operators
    const standardOperators = ['+', '-', '*', '/', '>', '<', '=', '<>', '<=', '>=', '!='];
    operators = [...standardOperators, ...operators];
    operators.forEach(op => {
        it(`supports ${op} operator`, () => {
            // Would be simpler to test with "foo${op}bar"
            // but this doesn't work with "-" operator in bigQuery,
            // where foo-bar is detected as identifier
            expect(format(`foo${op} bar ${op}zap`)).toBe(`foo ${op} bar ${op} zap`);
        });
    });
    operators.forEach(op => {
        it(`supports ${op} operator in dense mode`, () => {
            expect(format(`foo ${op} bar`, { denseOperators: true })).toBe(`foo${op}bar`);
        });
    });
    (cfg.logicalOperators || ['AND', 'OR']).forEach(op => {
        it(`supports ${op} operator`, () => {
            const result = format(`SELECT true ${op} false AS foo;`);
            expect(result).toBe((0, dedent_js_1.default) `
        SELECT
          true
          ${op} false AS foo;
      `);
        });
    });
    it('supports set operators', () => {
        expect(format('foo ALL bar')).toBe('foo ALL bar');
        expect(format('EXISTS bar')).toBe('EXISTS bar');
        expect(format('foo IN (1, 2, 3)')).toBe('foo IN (1, 2, 3)');
        expect(format("foo LIKE 'hello%'")).toBe("foo LIKE 'hello%'");
        expect(format('foo IS NULL')).toBe('foo IS NULL');
        expect(format('UNIQUE foo')).toBe('UNIQUE foo');
    });
    if (cfg.any) {
        it('supports ANY set-operator', () => {
            expect(format('foo = ANY (1, 2, 3)')).toBe('foo = ANY (1, 2, 3)');
        });
    }
}
//# sourceMappingURL=operators.js.map