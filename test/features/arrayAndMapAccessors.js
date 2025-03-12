"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsArrayAndMapAccessors;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsArrayAndMapAccessors(format) {
    it('supports square brackets for array indexing', () => {
        const result = format(`SELECT arr[1], order_lines[5].productId;`);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        arr[1],
        order_lines[5].productId;
    `);
    });
    // The check for yota['foo.bar-baz'] is for Issue #230
    it('supports square brackets for map lookup', () => {
        const result = format(`SELECT alpha['a'], beta['gamma'].zeta, yota['foo.bar-baz'];`);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        alpha['a'],
        beta['gamma'].zeta,
        yota['foo.bar-baz'];
    `);
    });
    it('supports square brackets for map lookup - uppercase', () => {
        const result = format(`SELECT Alpha['a'], Beta['gamma'].zeTa, yotA['foo.bar-baz'];`, {
            identifierCase: 'upper',
        });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        ALPHA['a'],
        BETA['gamma'].ZETA,
        YOTA['foo.bar-baz'];
    `);
    });
    it('supports namespaced array identifiers', () => {
        const result = format(`SELECT foo.coalesce['blah'];`);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        foo.coalesce['blah'];
    `);
    });
    it('formats array accessor with comment in-between', () => {
        const result = format(`SELECT arr /* comment */ [1];`);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        arr/* comment */ [1];
    `);
    });
    it('formats namespaced array accessor with comment in-between', () => {
        const result = format(`SELECT foo./* comment */arr[1];`);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        foo./* comment */ arr[1];
    `);
    });
    it('changes case of array accessors when identifierCase option used', () => {
        expect(format(`SELECT arr[1];`, { identifierCase: 'upper' })).toBe((0, dedent_js_1.default) `
      SELECT
        ARR[1];
    `);
        expect(format(`SELECT NS.Arr[1];`, { identifierCase: 'lower' })).toBe((0, dedent_js_1.default) `
      SELECT
        ns.arr[1];
    `);
    });
}
//# sourceMappingURL=arrayAndMapAccessors.js.map