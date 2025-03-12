"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dedent_js_1 = __importDefault(require("dedent-js"));
const sqlFormatter_js_1 = require("../src/sqlFormatter.js");
const behavesLikeSqlFormatter_js_1 = __importDefault(require("./behavesLikeSqlFormatter.js"));
const createTable_js_1 = __importDefault(require("./features/createTable.js"));
const dropTable_js_1 = __importDefault(require("./features/dropTable.js"));
const alterTable_js_1 = __importDefault(require("./features/alterTable.js"));
const schema_js_1 = __importDefault(require("./features/schema.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const between_js_1 = __importDefault(require("./features/between.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const constraints_js_1 = __importDefault(require("./features/constraints.js"));
const deleteFrom_js_1 = __importDefault(require("./features/deleteFrom.js"));
const comments_js_1 = __importDefault(require("./features/comments.js"));
const identifiers_js_1 = __importDefault(require("./features/identifiers.js"));
const param_js_1 = __importDefault(require("./options/param.js"));
const window_js_1 = __importDefault(require("./features/window.js"));
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const insertInto_js_1 = __importDefault(require("./features/insertInto.js"));
const update_js_1 = __importDefault(require("./features/update.js"));
const truncateTable_js_1 = __importDefault(require("./features/truncateTable.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('SqlFormatter', () => {
    const language = 'sql';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeSqlFormatter_js_1.default)(format);
    (0, comments_js_1.default)(format);
    (0, createView_js_1.default)(format);
    (0, createTable_js_1.default)(format);
    (0, dropTable_js_1.default)(format);
    (0, constraints_js_1.default)(format, ['CASCADE', 'SET NULL', 'SET DEFAULT', 'RESTRICT', 'NO ACTION']);
    (0, alterTable_js_1.default)(format, {
        addColumn: true,
        dropColumn: true,
        renameTo: true,
        renameColumn: true,
    });
    (0, deleteFrom_js_1.default)(format);
    (0, insertInto_js_1.default)(format);
    (0, update_js_1.default)(format, { whereCurrentOf: true });
    (0, truncateTable_js_1.default)(format);
    (0, strings_js_1.default)(format, ["''-qq", "''-bs", "X''", "N''", "U&''"]);
    (0, identifiers_js_1.default)(format, [`""-qq`, '``']);
    (0, between_js_1.default)(format);
    (0, schema_js_1.default)(format);
    (0, join_js_1.default)(format);
    (0, setOperations_js_1.default)(format);
    (0, operators_js_1.default)(format, ['||'], { any: true });
    (0, param_js_1.default)(format, { positional: true });
    (0, window_js_1.default)(format);
    (0, limiting_js_1.default)(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });
    (0, dataTypeCase_js_1.default)(format);
    it('throws error when encountering characters or operators it does not recognize', () => {
        expect(() => format('SELECT @name, :bar FROM foo;')).toThrowError(`Parse error: Unexpected "@name, :ba" at line 1 column 8`);
    });
    it('crashes when encountering unsupported curly braces', () => {
        expect(() => format((0, dedent_js_1.default) `
        SELECT
          {foo};
      `)).toThrowError('Parse error: Unexpected "{foo};" at line 2 column 3');
    });
    // Issue #702
    it('treats ASC and DESC as reserved keywords', () => {
        expect(format(`SELECT foo FROM bar ORDER BY foo asc, zap desc`, { keywordCase: 'upper' }))
            .toBe((0, dedent_js_1.default) `
        SELECT
          foo
        FROM
          bar
        ORDER BY
          foo ASC,
          zap DESC
      `);
    });
    it('formats ALTER TABLE ... ALTER COLUMN', () => {
        expect(format(`ALTER TABLE t ALTER COLUMN foo SET DEFAULT 5;
         ALTER TABLE t ALTER COLUMN foo DROP DEFAULT;
         ALTER TABLE t ALTER COLUMN foo DROP SCOPE CASCADE;
         ALTER TABLE t ALTER COLUMN foo RESTART WITH 10;`)).toBe((0, dedent_js_1.default) `
      ALTER TABLE t
      ALTER COLUMN foo
      SET DEFAULT 5;

      ALTER TABLE t
      ALTER COLUMN foo
      DROP DEFAULT;

      ALTER TABLE t
      ALTER COLUMN foo
      DROP SCOPE CASCADE;

      ALTER TABLE t
      ALTER COLUMN foo
      RESTART WITH 10;
    `);
    });
});
//# sourceMappingURL=sql.test.js.map