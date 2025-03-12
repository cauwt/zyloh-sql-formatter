"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsWith;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsWith(format) {
    it('formats WITH clause with multiple Common Table Expressions (CTE)', () => {
        const result = format(`
      WITH
      cte_1 AS (
        SELECT a FROM b WHERE c = 1
      ),
      cte_2 AS (
        SELECT c FROM d WHERE e = 2
      ),
      final AS (
        SELECT * FROM cte_1 LEFT JOIN cte_2 ON b = d
      )
      SELECT * FROM final;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      WITH
        cte_1 AS (
          SELECT
            a
          FROM
            b
          WHERE
            c = 1
        ),
        cte_2 AS (
          SELECT
            c
          FROM
            d
          WHERE
            e = 2
        ),
        final AS (
          SELECT
            *
          FROM
            cte_1
            LEFT JOIN cte_2 ON b = d
        )
      SELECT
        *
      FROM
        final;
    `);
    });
    it('formats WITH clause with parameterized CTE', () => {
        const result = format(`
      WITH cte_1(id, parent_id) AS (
        SELECT id, parent_id
        FROM tab1
        WHERE parent_id IS NULL
      )
      SELECT id, parent_id FROM cte_1;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      WITH
        cte_1 (id, parent_id) AS (
          SELECT
            id,
            parent_id
          FROM
            tab1
          WHERE
            parent_id IS NULL
        )
      SELECT
        id,
        parent_id
      FROM
        cte_1;
    `);
    });
}
//# sourceMappingURL=with.js.map