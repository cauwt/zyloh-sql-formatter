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
const deleteFrom_js_1 = __importDefault(require("./features/deleteFrom.js"));
const comments_js_1 = __importDefault(require("./features/comments.js"));
const identifiers_js_1 = __importDefault(require("./features/identifiers.js"));
const arrayAndMapAccessors_js_1 = __importDefault(require("./features/arrayAndMapAccessors.js"));
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const insertInto_js_1 = __importDefault(require("./features/insertInto.js"));
const update_js_1 = __importDefault(require("./features/update.js"));
const truncateTable_js_1 = __importDefault(require("./features/truncateTable.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const constraints_js_1 = __importDefault(require("./features/constraints.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('SnowflakeFormatter', () => {
    const language = 'snowflake';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeSqlFormatter_js_1.default)(format);
    (0, comments_js_1.default)(format, { doubleSlashComments: true });
    (0, createView_js_1.default)(format, { orReplace: true, ifNotExists: true });
    (0, createTable_js_1.default)(format, {
        orReplace: true,
        ifNotExists: true,
        columnComment: true,
        tableComment: true,
    });
    (0, constraints_js_1.default)(format, ['CASCADE', 'SET NULL', 'SET DEFAULT', 'RESTRICT', 'NO ACTION']);
    (0, dropTable_js_1.default)(format, { ifExists: true });
    (0, arrayAndMapAccessors_js_1.default)(format);
    (0, alterTable_js_1.default)(format, {
        addColumn: true,
        dropColumn: true,
        modify: true,
        renameTo: true,
        renameColumn: true,
    });
    (0, deleteFrom_js_1.default)(format);
    (0, insertInto_js_1.default)(format);
    (0, update_js_1.default)(format);
    (0, truncateTable_js_1.default)(format, { withoutTable: true });
    (0, strings_js_1.default)(format, ["''-bs", "''-qq"]);
    (0, identifiers_js_1.default)(format, [`""-qq`]);
    (0, between_js_1.default)(format);
    // ':' and '::' are tested later, since they should always be dense
    (0, operators_js_1.default)(format, ['%', '||', '=>', ':='], { any: true });
    (0, join_js_1.default)(format, { without: ['NATURAL INNER JOIN'] });
    (0, setOperations_js_1.default)(format, ['UNION', 'UNION ALL', 'MINUS', 'EXCEPT', 'INTERSECT']);
    (0, limiting_js_1.default)(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });
    (0, dataTypeCase_js_1.default)(format);
    it('allows $ character as part of unquoted identifiers', () => {
        expect(format('SELECT foo$')).toBe((0, dedent_js_1.default) `
      SELECT
        foo$
    `);
    });
    describe(`formats traversal of semi structured data`, () => {
        it(`formats ':' path-operator without spaces`, () => {
            expect(format(`SELECT foo : bar`)).toBe((0, dedent_js_1.default) `
        SELECT
          foo:bar
      `);
        });
        it(`formats ':' path-operator followed by dots without spaces`, () => {
            expect(format(`SELECT foo : bar . baz`)).toBe((0, dedent_js_1.default) `
        SELECT
          foo:bar.baz
      `);
        });
        it(`formats ':' path-operator when followed by reserved keyword`, () => {
            expect(format(`SELECT foo : from`)).toBe((0, dedent_js_1.default) `
        SELECT
          foo:from
      `);
        });
    });
    it('formats type-cast operator without spaces', () => {
        expect(format('SELECT 2 :: numeric AS foo;')).toBe((0, dedent_js_1.default) `
      SELECT
        2::numeric AS foo;
    `);
    });
    it('supports $$-quoted strings', () => {
        expect(format(`SELECT $$foo' JOIN"$bar$$, $$foo$$$$bar$$`)).toBe((0, dedent_js_1.default) `
      SELECT
        $$foo' JOIN"$bar$$,
        $$foo$$ $$bar$$
    `);
    });
    it('supports QUALIFY clause', () => {
        expect(format(`SELECT * FROM tbl QUALIFY ROW_NUMBER() OVER my_window = 1`)).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        tbl
      QUALIFY
        ROW_NUMBER() OVER my_window = 1
    `);
    });
    it('formats ALTER TABLE ... ALTER COLUMN', () => {
        expect(format(`ALTER TABLE t ALTER COLUMN foo SET DATA TYPE VARCHAR;
         ALTER TABLE t ALTER COLUMN foo SET DEFAULT 5;
         ALTER TABLE t ALTER COLUMN foo DROP DEFAULT;
         ALTER TABLE t ALTER COLUMN foo SET NOT NULL;
         ALTER TABLE t ALTER COLUMN foo DROP NOT NULL;
         ALTER TABLE t ALTER COLUMN foo COMMENT 'blah';
         ALTER TABLE t ALTER COLUMN foo UNSET COMMENT;
         ALTER TABLE t ALTER COLUMN foo SET MASKING POLICY polis;
         ALTER TABLE t ALTER COLUMN foo UNSET MASKING POLICY;
         ALTER TABLE t ALTER COLUMN foo SET TAG tname = 10;
         ALTER TABLE t ALTER COLUMN foo UNSET TAG tname;`)).toBe((0, dedent_js_1.default) `
      ALTER TABLE t
      ALTER COLUMN foo
      SET DATA TYPE VARCHAR;

      ALTER TABLE t
      ALTER COLUMN foo
      SET DEFAULT 5;

      ALTER TABLE t
      ALTER COLUMN foo
      DROP DEFAULT;

      ALTER TABLE t
      ALTER COLUMN foo
      SET NOT NULL;

      ALTER TABLE t
      ALTER COLUMN foo
      DROP NOT NULL;

      ALTER TABLE t
      ALTER COLUMN foo COMMENT 'blah';

      ALTER TABLE t
      ALTER COLUMN foo
      UNSET COMMENT;

      ALTER TABLE t
      ALTER COLUMN foo
      SET MASKING POLICY polis;

      ALTER TABLE t
      ALTER COLUMN foo
      UNSET MASKING POLICY;

      ALTER TABLE t
      ALTER COLUMN foo
      SET TAG tname = 10;

      ALTER TABLE t
      ALTER COLUMN foo
      UNSET TAG tname;
    `);
    });
    it('detects data types', () => {
        expect(format(`CREATE TABLE tbl (first_column double Precision, second_column numBer (38, 0), third String);`, {
            dataTypeCase: 'upper',
        })).toBe((0, dedent_js_1.default) `
    CREATE TABLE tbl (
      first_column DOUBLE PRECISION,
      second_column NUMBER(38, 0),
      third STRING
    );`);
    });
    // Issue #771
    it('allows TYPE to be used as an identifier', () => {
        expect(format(`SELECT CASE WHEN type = 'upgrade' THEN amount ELSE 0 END FROM items;`))
            .toBe((0, dedent_js_1.default) `
      SELECT
        CASE
          WHEN type = 'upgrade' THEN amount
          ELSE 0
        END
      FROM
        items;
    `);
    });
    // Issue #771
    it('supports lambda expressions', () => {
        expect(format(`SELECT FILTER(my_arr, a -> a:value >= 50);`)).toBe((0, dedent_js_1.default) `
      SELECT
        FILTER(my_arr, a -> a:value >= 50);
    `);
    });
});
//# sourceMappingURL=snowflake.test.js.map