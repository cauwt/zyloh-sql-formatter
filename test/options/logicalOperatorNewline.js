"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsLogicalOperatorNewline;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsLogicalOperatorNewline(format) {
    it('by default adds newline before logical operator', () => {
        const result = format('SELECT a WHERE true AND false;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        a
      WHERE
        true
        AND false;
    `);
    });
    it('supports newline after logical operator', () => {
        const result = format('SELECT a WHERE true AND false;', {
            logicalOperatorNewline: 'after',
        });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        a
      WHERE
        true AND
        false;
    `);
    });
}
//# sourceMappingURL=logicalOperatorNewline.js.map