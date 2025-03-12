"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dedent_js_1 = __importDefault(require("dedent-js"));
const sqlFormatter_js_1 = require("../src/sqlFormatter.js");
const behavesLikeSqlFormatter_js_1 = __importDefault(require("./behavesLikeSqlFormatter.js"));
const arrayLiterals_js_1 = __importDefault(require("./features/arrayLiterals.js"));
const between_js_1 = __importDefault(require("./features/between.js"));
const createTable_js_1 = __importDefault(require("./features/createTable.js"));
const dropTable_js_1 = __importDefault(require("./features/dropTable.js"));
const deleteFrom_js_1 = __importDefault(require("./features/deleteFrom.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const arrayAndMapAccessors_js_1 = __importDefault(require("./features/arrayAndMapAccessors.js"));
const comments_js_1 = __importDefault(require("./features/comments.js"));
const commentOn_js_1 = __importDefault(require("./features/commentOn.js"));
const identifiers_js_1 = __importDefault(require("./features/identifiers.js"));
const param_js_1 = __importDefault(require("./options/param.js"));
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const window_js_1 = __importDefault(require("./features/window.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const insertInto_js_1 = __importDefault(require("./features/insertInto.js"));
const update_js_1 = __importDefault(require("./features/update.js"));
const truncateTable_js_1 = __importDefault(require("./features/truncateTable.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const alterTable_js_1 = __importDefault(require("./features/alterTable.js"));
const isDistinctFrom_js_1 = __importDefault(require("./features/isDistinctFrom.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('TrinoFormatter', () => {
    const language = 'trino';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeSqlFormatter_js_1.default)(format);
    (0, comments_js_1.default)(format);
    (0, commentOn_js_1.default)(format);
    (0, createView_js_1.default)(format, { orReplace: true, materialized: true });
    (0, createTable_js_1.default)(format, { ifNotExists: true });
    (0, dropTable_js_1.default)(format, { ifExists: true });
    (0, alterTable_js_1.default)(format, {
        addColumn: true,
        dropColumn: true,
        renameTo: true,
        renameColumn: true,
    });
    (0, deleteFrom_js_1.default)(format);
    (0, insertInto_js_1.default)(format);
    (0, update_js_1.default)(format);
    (0, truncateTable_js_1.default)(format);
    (0, strings_js_1.default)(format, ["''-qq", "X''", "U&''"]);
    (0, identifiers_js_1.default)(format, [`""-qq`]);
    (0, between_js_1.default)(format);
    // Missing: '?' operator (for row patterns)
    (0, operators_js_1.default)(format, ['%', '->', '=>', '||', '|', '^', '$'], { any: true });
    (0, isDistinctFrom_js_1.default)(format);
    (0, arrayLiterals_js_1.default)(format, { withArrayPrefix: true });
    (0, arrayAndMapAccessors_js_1.default)(format);
    (0, join_js_1.default)(format);
    (0, setOperations_js_1.default)(format);
    (0, param_js_1.default)(format, { positional: true });
    (0, window_js_1.default)(format);
    (0, limiting_js_1.default)(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });
    (0, dataTypeCase_js_1.default)(format);
    it('formats SET SESSION', () => {
        const result = format('SET SESSION foo = 444;');
        expect(result).toBe((0, dedent_js_1.default) `
      SET SESSION foo = 444;
    `);
    });
    it('formats row PATTERN()s', () => {
        const result = format(`
      SELECT * FROM orders MATCH_RECOGNIZE(
        PARTITION BY custkey
        ORDER BY orderdate
        MEASURES
                  A.totalprice AS starting_price,
                  LAST(B.totalprice) AS bottom_price,
                  LAST(U.totalprice) AS top_price
        ONE ROW PER MATCH
        AFTER MATCH SKIP PAST LAST ROW
        PATTERN ((A | B){5} {- C+ D+ -} E+)
        SUBSET U = (C, D)
        DEFINE
                  B AS totalprice < PREV(totalprice),
                  C AS totalprice > PREV(totalprice) AND totalprice <= A.totalprice,
                  D AS totalprice > PREV(totalprice)
        )
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        orders
      MATCH_RECOGNIZE
        (
          PARTITION BY
            custkey
          ORDER BY
            orderdate
          MEASURES
            A.totalprice AS starting_price,
            LAST(B.totalprice) AS bottom_price,
            LAST(U.totalprice) AS top_price
          ONE ROW PER MATCH
          AFTER MATCH
            SKIP PAST LAST ROW
          PATTERN
            ((A | B) {5} {- C + D + -} E +)
          SUBSET
            U = (C, D)
          DEFINE
            B AS totalprice < PREV(totalprice),
            C AS totalprice > PREV(totalprice)
            AND totalprice <= A.totalprice,
            D AS totalprice > PREV(totalprice)
        )
    `);
    });
});
//# sourceMappingURL=trino.test.js.map