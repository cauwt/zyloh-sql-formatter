"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardSetOperations = void 0;
exports.default = supportsSetOperations;
const dedent_js_1 = __importDefault(require("dedent-js"));
exports.standardSetOperations = [
    'UNION',
    'UNION ALL',
    'UNION DISTINCT',
    'EXCEPT',
    'EXCEPT ALL',
    'EXCEPT DISTINCT',
    'INTERSECT',
    'INTERSECT ALL',
    'INTERSECT DISTINCT',
];
function supportsSetOperations(format, operations = exports.standardSetOperations) {
    operations.forEach(op => {
        it(`formats ${op}`, () => {
            expect(format(`SELECT * FROM foo ${op} SELECT * FROM bar;`)).toBe((0, dedent_js_1.default) `
        SELECT
          *
        FROM
          foo
        ${op}
        SELECT
          *
        FROM
          bar;
      `);
        });
        it(`formats ${op} inside subquery`, () => {
            expect(format(`SELECT * FROM (SELECT * FROM foo ${op} SELECT * FROM bar) AS tbl;`))
                .toBe((0, dedent_js_1.default) `
        SELECT
          *
        FROM
          (
            SELECT
              *
            FROM
              foo
            ${op}
            SELECT
              *
            FROM
              bar
          ) AS tbl;
      `);
        });
    });
}
//# sourceMappingURL=setOperations.js.map