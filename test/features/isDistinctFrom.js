"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsIsDistinctFrom;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsIsDistinctFrom(format) {
    // Regression test for #564
    it('formats IS [NOT] DISTINCT FROM operator', () => {
        expect(format('SELECT x IS DISTINCT FROM y, x IS NOT DISTINCT FROM y')).toBe((0, dedent_js_1.default) `
      SELECT
        x IS DISTINCT FROM y,
        x IS NOT DISTINCT FROM y
    `);
    });
}
//# sourceMappingURL=isDistinctFrom.js.map