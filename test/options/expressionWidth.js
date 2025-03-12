"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsExpressionWidth;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsExpressionWidth(format) {
    it('throws error when expressionWidth negative number', () => {
        expect(() => {
            format('SELECT *', { expressionWidth: -2 });
        }).toThrowErrorMatchingInlineSnapshot(`"expressionWidth config must be positive number. Received -2 instead."`);
    });
    it('throws error when expressionWidth is zero', () => {
        expect(() => {
            format('SELECT *', { expressionWidth: 0 });
        }).toThrowErrorMatchingInlineSnapshot(`"expressionWidth config must be positive number. Received 0 instead."`);
    });
    it('breaks paranthesized expressions to multiple lines when they exceed expressionWidth', () => {
        const result = format('SELECT product.price + (product.original_price * product.sales_tax) AS total FROM product;', {
            expressionWidth: 40,
        });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        product.price + (
          product.original_price * product.sales_tax
        ) AS total
      FROM
        product;
    `);
    });
    it('keeps paranthesized expressions on single lines when they do not exceed expressionWidth', () => {
        const result = format('SELECT product.price + (product.original_price * product.sales_tax) AS total FROM product;', {
            expressionWidth: 50,
        });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        product.price + (product.original_price * product.sales_tax) AS total
      FROM
        product;
    `);
    });
    it('calculates parenthesized expression length (also considering spaces)', () => {
        const result = format('SELECT (price * tax) AS total FROM table_name WHERE (amount > 25);', {
            expressionWidth: 10,
            denseOperators: true,
        });
        expect(result).toBe((0, dedent_js_1.default) `
    SELECT
      (price*tax) AS total
    FROM
      table_name
    WHERE
      (amount>25);
    `);
    });
    it('formats inline when length of substituted parameters < expressionWidth', () => {
        const result = format('SELECT (?, ?, ?) AS total;', {
            expressionWidth: 11,
            paramTypes: { positional: true },
            params: ['10', '20', '30'],
        });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        (10, 20, 30) AS total;
    `);
    });
    it('formats NOT-inline when length of substituted parameters > expressionWidth', () => {
        const result = format('SELECT (?, ?, ?) AS total;', {
            expressionWidth: 11,
            paramTypes: { positional: true },
            params: ['100', '200', '300'],
        });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        (
          100,
          200,
          300
        ) AS total;
    `);
    });
}
//# sourceMappingURL=expressionWidth.js.map