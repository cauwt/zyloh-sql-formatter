"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dedent_js_1 = __importDefault(require("dedent-js"));
const sqlFormatter_js_1 = require("../src/sqlFormatter.js");
const behavesLikeSqlFormatter_js_1 = __importDefault(require("./behavesLikeSqlFormatter.js"));
const alterTable_js_1 = __importDefault(require("./features/alterTable.js"));
const between_js_1 = __importDefault(require("./features/between.js"));
const createTable_js_1 = __importDefault(require("./features/createTable.js"));
const dropTable_js_1 = __importDefault(require("./features/dropTable.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const arrayAndMapAccessors_js_1 = __importDefault(require("./features/arrayAndMapAccessors.js"));
const comments_js_1 = __importDefault(require("./features/comments.js"));
const identifiers_js_1 = __importDefault(require("./features/identifiers.js"));
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const insertInto_js_1 = __importDefault(require("./features/insertInto.js"));
const truncateTable_js_1 = __importDefault(require("./features/truncateTable.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('SparkFormatter', () => {
    const language = 'spark';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeSqlFormatter_js_1.default)(format);
    (0, comments_js_1.default)(format);
    (0, createView_js_1.default)(format, { orReplace: true, ifNotExists: true });
    (0, createTable_js_1.default)(format, { ifNotExists: true, columnComment: true, tableComment: true });
    (0, dropTable_js_1.default)(format, { ifExists: true });
    (0, alterTable_js_1.default)(format, {
        dropColumn: true,
        renameTo: true,
        renameColumn: true,
    });
    (0, insertInto_js_1.default)(format, { withoutInto: true });
    (0, truncateTable_js_1.default)(format);
    (0, strings_js_1.default)(format, ["''-bs", '""-bs', "X''", 'X""', "R''", 'R""']);
    (0, identifiers_js_1.default)(format, ['``']);
    (0, between_js_1.default)(format);
    (0, operators_js_1.default)(format, ['%', '~', '^', '|', '&', '<=>', '==', '!', '||', '->'], {
        logicalOperators: ['AND', 'OR', 'XOR'],
        any: true,
    });
    (0, arrayAndMapAccessors_js_1.default)(format);
    (0, join_js_1.default)(format, {
        additionally: [
            // non-standard anti-join:
            'ANTI JOIN',
            'LEFT ANTI JOIN',
            'NATURAL ANTI JOIN',
            'NATURAL LEFT ANTI JOIN',
            // non-standard semi-join
            'SEMI JOIN',
            'LEFT SEMI JOIN',
            'NATURAL SEMI JOIN',
            'NATURAL LEFT SEMI JOIN',
        ],
    });
    (0, setOperations_js_1.default)(format);
    (0, limiting_js_1.default)(format, { limit: true });
    (0, dataTypeCase_js_1.default)(format);
    it('formats basic WINDOW clause', () => {
        const result = format(`SELECT * FROM tbl WINDOW win1, WINDOW win2, WINDOW win3;`);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        tbl
      WINDOW
        win1,
      WINDOW
        win2,
      WINDOW
        win3;
    `);
    });
    it('formats window function and end as inline', () => {
        const result = format(`SELECT window(time, '1 hour').start AS window_start, window(time, '1 hour').end AS window_end FROM tbl;`);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        window(time, '1 hour').start AS window_start,
        window(time, '1 hour').end AS window_end
      FROM
        tbl;
    `);
    });
    // eslint-disable-next-line no-template-curly-in-string
    it('recognizes ${name} substitution variables', () => {
        const result = format(
        // eslint-disable-next-line no-template-curly-in-string
        "SELECT ${var1}, ${ var 2 } FROM ${table_name} WHERE name = '${name}';");
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        \${var1},
        \${ var 2 }
      FROM
        \${table_name}
      WHERE
        name = '\${name}';
    `);
    });
    it('supports SORT BY, CLUSTER BY, DISTRIBUTE BY', () => {
        const result = format('SELECT value, count DISTRIBUTE BY count CLUSTER BY value SORT BY value, count;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        value,
        count
      DISTRIBUTE BY
        count
      CLUSTER BY
        value
      SORT BY
        value,
        count;
    `);
    });
    it('formats ALTER TABLE ... ALTER COLUMN', () => {
        expect(format(`ALTER TABLE StudentInfo ALTER COLUMN FirstName COMMENT "new comment";`))
            .toBe((0, dedent_js_1.default) `
      ALTER TABLE StudentInfo
      ALTER COLUMN FirstName COMMENT "new comment";
    `);
    });
});
//# sourceMappingURL=spark.test.js.map