"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsFunctionCase;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsFunctionCase(format) {
    it('preserves function name case by default', () => {
        const result = format('SELECT MiN(price) AS min_price, Cast(item_code AS INT) FROM products');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        MiN(price) AS min_price,
        Cast(item_code AS INT)
      FROM
        products
    `);
    });
    it('converts function names to uppercase', () => {
        const result = format('SELECT MiN(price) AS min_price, Cast(item_code AS INT) FROM products', {
            functionCase: 'upper',
        });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        MIN(price) AS min_price,
        CAST(item_code AS INT)
      FROM
        products
    `);
    });
    it('converts function names to lowercase', () => {
        const result = format('SELECT MiN(price) AS min_price, Cast(item_code AS INT) FROM products', {
            functionCase: 'lower',
        });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        min(price) AS min_price,
        cast(item_code AS INT)
      FROM
        products
    `);
    });
}
//# sourceMappingURL=functionCase.js.map