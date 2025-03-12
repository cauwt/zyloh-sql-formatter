"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dedent_js_1 = __importDefault(require("dedent-js"));
const sqlFormatter_js_1 = require("../src/sqlFormatter.js");
const behavesLikeMariaDbFormatter_js_1 = __importDefault(require("./behavesLikeMariaDbFormatter.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const window_js_1 = __importDefault(require("./features/window.js"));
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const createTable_js_1 = __importDefault(require("./features/createTable.js"));
const param_js_1 = __importDefault(require("./options/param.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const alterTable_js_1 = __importDefault(require("./features/alterTable.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const constraints_js_1 = __importDefault(require("./features/constraints.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
// For now these tests are exactly the same as for MySQL
describe('TiDBFormatter', () => {
    const language = 'tidb';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeMariaDbFormatter_js_1.default)(format);
    // in addition to string types listed in behavesLikeMariaDbFormatter
    (0, strings_js_1.default)(format, ["N''"]);
    (0, join_js_1.default)(format, {
        without: ['FULL'],
        additionally: ['STRAIGHT_JOIN'],
    });
    (0, setOperations_js_1.default)(format, ['UNION', 'UNION ALL', 'UNION DISTINCT']);
    (0, operators_js_1.default)(format, ['%', ':=', '&', '|', '^', '~', '<<', '>>', '<=>', '->', '->>', '&&', '||', '!'], {
        logicalOperators: ['AND', 'OR', 'XOR'],
        any: true,
    });
    (0, window_js_1.default)(format);
    (0, limiting_js_1.default)(format, { limit: true, offset: true });
    (0, createTable_js_1.default)(format, { ifNotExists: true, columnComment: true, tableComment: true });
    (0, constraints_js_1.default)(format, [
        'RESTRICT',
        'CASCADE',
        'SET NULL',
        'NO ACTION',
        'NOW',
        'CURRENT_TIMESTAMP',
    ]);
    (0, param_js_1.default)(format, { positional: true });
    (0, createView_js_1.default)(format, { orReplace: true });
    (0, alterTable_js_1.default)(format, {
        addColumn: true,
        dropColumn: true,
        modify: true,
        renameTo: true,
        renameColumn: true,
    });
    (0, dataTypeCase_js_1.default)(format);
    it(`supports @"name" variables`, () => {
        expect(format(`SELECT @"foo fo", @"foo\\"x", @"foo""y" FROM tbl;`)).toBe((0, dedent_js_1.default) `
      SELECT
        @"foo fo",
        @"foo\\"x",
        @"foo""y"
      FROM
        tbl;
    `);
    });
    it(`supports @'name' variables`, () => {
        expect(format(`SELECT @'bar ar', @'bar\\'x', @'bar''y' FROM tbl;`)).toBe((0, dedent_js_1.default) `
      SELECT
        @'bar ar',
        @'bar\\'x',
        @'bar''y'
      FROM
        tbl;
    `);
    });
    it('formats ALTER TABLE ... ALTER COLUMN', () => {
        expect(format(`ALTER TABLE t ALTER COLUMN foo SET DEFAULT 10;
         ALTER TABLE t ALTER COLUMN foo DROP DEFAULT;`)).toBe((0, dedent_js_1.default) `
      ALTER TABLE t
      ALTER COLUMN foo
      SET DEFAULT 10;

      ALTER TABLE t
      ALTER COLUMN foo
      DROP DEFAULT;
    `);
    });
});
//# sourceMappingURL=tidb.test.js.map