"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsWindow;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsWindow(format) {
    it('formats WINDOW clause at top level', () => {
        const result = format('SELECT *, ROW_NUMBER() OVER wnd AS next_value FROM tbl WINDOW wnd AS (PARTITION BY id ORDER BY time);');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *,
        ROW_NUMBER() OVER wnd AS next_value
      FROM
        tbl
      WINDOW
        wnd AS (
          PARTITION BY
            id
          ORDER BY
            time
        );
    `);
    });
    it('formats multiple WINDOW specifications', () => {
        const result = format('SELECT * FROM table1 WINDOW w1 AS (PARTITION BY col1), w2 AS (PARTITION BY col1, col2);');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        table1
      WINDOW
        w1 AS (
          PARTITION BY
            col1
        ),
        w2 AS (
          PARTITION BY
            col1,
            col2
        );
    `);
    });
}
//# sourceMappingURL=window.js.map