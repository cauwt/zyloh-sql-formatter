"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsWindowFunctions;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsWindowFunctions(format) {
    it('supports ROWS BETWEEN in window functions', () => {
        expect(format(`
        SELECT
          RANK() OVER (
            PARTITION BY explosion
            ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
          ) AS amount
        FROM
          tbl
      `)).toBe((0, dedent_js_1.default) `
      SELECT
        RANK() OVER (
          PARTITION BY
            explosion
          ORDER BY
            day ROWS BETWEEN 6 PRECEDING
            AND CURRENT ROW
        ) AS amount
      FROM
        tbl
    `);
    });
}
//# sourceMappingURL=windowFunctions.js.map