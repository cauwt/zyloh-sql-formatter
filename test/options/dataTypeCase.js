"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsDataTypeCase;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsDataTypeCase(format) {
    it('preserves data type keyword case by default', () => {
        const result = format('CREATE TABLE users ( user_id iNt PRIMARY KEY, total_earnings Decimal(5, 2) NOT NULL )');
        expect(result).toBe((0, dedent_js_1.default) `
      CREATE TABLE users (
        user_id iNt PRIMARY KEY,
        total_earnings Decimal(5, 2) NOT NULL
      )
    `);
    });
    it('converts data type keyword case to uppercase', () => {
        const result = format('CREATE TABLE users ( user_id iNt PRIMARY KEY, total_earnings Decimal(5, 2) NOT NULL )', {
            dataTypeCase: 'upper',
        });
        expect(result).toBe((0, dedent_js_1.default) `
      CREATE TABLE users (
        user_id INT PRIMARY KEY,
        total_earnings DECIMAL(5, 2) NOT NULL
      )
    `);
    });
    it('converts data type keyword case to lowercase', () => {
        const result = format('CREATE TABLE users ( user_id iNt PRIMARY KEY, total_earnings Decimal(5, 2) NOT NULL )', {
            dataTypeCase: 'lower',
        });
        expect(result).toBe((0, dedent_js_1.default) `
      CREATE TABLE users (
        user_id int PRIMARY KEY,
        total_earnings decimal(5, 2) NOT NULL
      )
    `);
    });
}
//# sourceMappingURL=dataTypeCase.js.map