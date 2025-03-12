"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsBetween;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsBetween(format) {
    it('formats BETWEEN _ AND _ on single line', () => {
        expect(format('foo BETWEEN bar AND baz')).toBe('foo BETWEEN bar AND baz');
    });
    it('supports qualified.names as BETWEEN expression values', () => {
        expect(format('foo BETWEEN t.bar AND t.baz')).toBe('foo BETWEEN t.bar AND t.baz');
    });
    it('formats BETWEEN with comments inside', () => {
        expect(format('WHERE foo BETWEEN /*C1*/ t.bar /*C2*/ AND /*C3*/ t.baz')).toBe((0, dedent_js_1.default) `
      WHERE
        foo BETWEEN /*C1*/ t.bar /*C2*/ AND /*C3*/ t.baz
    `);
    });
    it('supports complex expressions inside BETWEEN', () => {
        // Not ideal, but better than crashing
        expect(format('foo BETWEEN 1+2 AND 3+4')).toBe('foo BETWEEN 1 + 2 AND 3  + 4');
    });
    it('supports CASE inside BETWEEN', () => {
        expect(format('foo BETWEEN CASE x WHEN 1 THEN 2 END AND 3')).toBe((0, dedent_js_1.default) `
      foo BETWEEN CASE x
        WHEN 1 THEN 2
      END AND 3
    `);
    });
    // Regression test for #534
    it('supports AND after BETWEEN', () => {
        expect(format('SELECT foo BETWEEN 1 AND 2 AND x > 10')).toBe((0, dedent_js_1.default) `
      SELECT
        foo BETWEEN 1 AND 2
        AND x > 10
    `);
    });
}
//# sourceMappingURL=between.js.map