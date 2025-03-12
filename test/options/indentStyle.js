"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsIndentStyle;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsIndentStyle(format) {
    const baseQuery = `
    SELECT COUNT(a.column1), MAX(b.column2 + b.column3), b.column4 AS four
    FROM ( SELECT column1, column5 FROM table1 ) a
    JOIN table2 b ON a.column5 = b.column5
    WHERE column6 AND column7
    GROUP BY column4;
  `;
    it('supports standard mode', () => {
        const result = format(baseQuery, { indentStyle: 'standard' });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        COUNT(a.column1),
        MAX(b.column2 + b.column3),
        b.column4 AS four
      FROM
        (
          SELECT
            column1,
            column5
          FROM
            table1
        ) a
        JOIN table2 b ON a.column5 = b.column5
      WHERE
        column6
        AND column7
      GROUP BY
        column4;
    `);
    });
    describe('indentStyle: tabularLeft', () => {
        it('aligns clause keywords to left', () => {
            const result = format(baseQuery, { indentStyle: 'tabularLeft' });
            expect(result).toBe((0, dedent_js_1.default) `
        SELECT    COUNT(a.column1),
                  MAX(b.column2 + b.column3),
                  b.column4 AS four
        FROM      (
                  SELECT    column1,
                            column5
                  FROM      table1
                  ) a
        JOIN      table2 b ON a.column5 = b.column5
        WHERE     column6
        AND       column7
        GROUP BY  column4;
      `);
        });
        it('handles long keywords', () => {
            expect(format((0, dedent_js_1.default) `
            SELECT *
            FROM a
            UNION ALL
            SELECT *
            FROM b
            LEFT OUTER JOIN c;
          `, { indentStyle: 'tabularLeft' })).toBe((0, dedent_js_1.default) `
        SELECT    *
        FROM      a
        UNION ALL
        SELECT    *
        FROM      b
        LEFT      OUTER JOIN c;
      `);
        });
        // Regression test for issue #383
        it('correctly indents set operations inside subqueries', () => {
            expect(format(`SELECT * FROM (
            SELECT * FROM a
            UNION ALL
            SELECT * FROM b) AS tbl;`, { indentStyle: 'tabularLeft' })).toBe((0, dedent_js_1.default) `
        SELECT    *
        FROM      (
                  SELECT    *
                  FROM      a
                  UNION ALL
                  SELECT    *
                  FROM      b
                  ) AS tbl;
        `);
        });
        it('handles multiple levels of nested queries', () => {
            expect(format('SELECT age FROM (SELECT fname, lname, age FROM (SELECT fname, lname FROM persons) JOIN (SELECT age FROM ages)) as mytable;', {
                indentStyle: 'tabularLeft',
            })).toBe((0, dedent_js_1.default) `
        SELECT    age
        FROM      (
                  SELECT    fname,
                            lname,
                            age
                  FROM      (
                            SELECT    fname,
                                      lname
                            FROM      persons
                            )
                  JOIN      (
                            SELECT    age
                            FROM      ages
                            )
                  ) as mytable;
      `);
        });
        it('does not indent semicolon when newlineBeforeSemicolon:true used', () => {
            expect(format('SELECT firstname, lastname, age FROM customers;', {
                indentStyle: 'tabularLeft',
                newlineBeforeSemicolon: true,
            })).toBe((0, dedent_js_1.default) `
        SELECT    firstname,
                  lastname,
                  age
        FROM      customers
        ;
      `);
        });
        // Regression test for issue #341
        it('formats BETWEEN..AND', () => {
            expect(format('SELECT * FROM tbl WHERE id BETWEEN 1 AND 5000;', { indentStyle: 'tabularLeft' })).toBe((0, dedent_js_1.default) `
        SELECT    *
        FROM      tbl
        WHERE     id BETWEEN 1 AND 5000;
      `);
        });
    });
    describe('indentStyle: tabularRight', () => {
        it('aligns clause keywords to right', () => {
            const result = format(baseQuery, { indentStyle: 'tabularRight' });
            expect(result).toBe([
                '   SELECT COUNT(a.column1),',
                '          MAX(b.column2 + b.column3),',
                '          b.column4 AS four',
                '     FROM (',
                '             SELECT column1,',
                '                    column5',
                '               FROM table1',
                '          ) a',
                '     JOIN table2 b ON a.column5 = b.column5',
                '    WHERE column6',
                '      AND column7',
                ' GROUP BY column4;',
            ].join('\n'));
        });
        it('handles long keywords', () => {
            expect(format((0, dedent_js_1.default) `
            SELECT *
            FROM a
            UNION ALL
            SELECT *
            FROM b
            LEFT OUTER JOIN c;
          `, { indentStyle: 'tabularRight' })).toBe([
                '   SELECT *',
                '     FROM a',
                'UNION ALL',
                '   SELECT *',
                '     FROM b',
                '     LEFT OUTER JOIN c;',
            ].join('\n'));
        });
        // Regression test for issue #341
        it('formats BETWEEN..AND', () => {
            expect(format('SELECT * FROM tbl WHERE id BETWEEN 1 AND 5000;', { indentStyle: 'tabularRight' })).toBe([
                // ...comment to force multi-line array...
                '   SELECT *',
                '     FROM tbl',
                '    WHERE id BETWEEN 1 AND 5000;',
            ].join('\n'));
        });
    });
}
//# sourceMappingURL=indentStyle.js.map