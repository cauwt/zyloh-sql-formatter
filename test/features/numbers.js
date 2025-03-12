"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsNumbers;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsNumbers(format) {
    it('supports decimal numbers', () => {
        const result = format('SELECT 42, -35.04, 105., 2.53E+3, 1.085E-5;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        42,
        -35.04,
        105.,
        2.53E+3,
        1.085E-5;
    `);
    });
    it('supports hex and binary numbers', () => {
        const result = format('SELECT 0xAE, 0x10F, 0b1010001;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        0xAE,
        0x10F,
        0b1010001;
    `);
    });
    it('correctly handles floats as single tokens', () => {
        const result = format('SELECT 1e-9 AS a, 1.5e+10 AS b, 3.5E12 AS c, 3.5e12 AS d;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        1e-9 AS a,
        1.5e+10 AS b,
        3.5E12 AS c,
        3.5e12 AS d;
    `);
    });
    it('correctly handles floats with trailing point', () => {
        let result = format('SELECT 1000. AS a;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        1000. AS a;
    `);
        result = format('SELECT a, b / 1000. AS a_s, 100. * b / SUM(a_s);');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        a,
        b / 1000. AS a_s,
        100. * b / SUM(a_s);
    `);
    });
    it('supports decimal values without leading digits', () => {
        const result = format(`SELECT .456 AS foo;`);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        .456 AS foo;
    `);
    });
}
//# sourceMappingURL=numbers.js.map