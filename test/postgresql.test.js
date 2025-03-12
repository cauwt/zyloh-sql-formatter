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
const schema_js_1 = __importDefault(require("./features/schema.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const returning_js_1 = __importDefault(require("./features/returning.js"));
const constraints_js_1 = __importDefault(require("./features/constraints.js"));
const deleteFrom_js_1 = __importDefault(require("./features/deleteFrom.js"));
const comments_js_1 = __importDefault(require("./features/comments.js"));
const commentOn_js_1 = __importDefault(require("./features/commentOn.js"));
const identifiers_js_1 = __importDefault(require("./features/identifiers.js"));
const param_js_1 = __importDefault(require("./options/param.js"));
const arrayAndMapAccessors_js_1 = __importDefault(require("./features/arrayAndMapAccessors.js"));
const window_js_1 = __importDefault(require("./features/window.js"));
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const insertInto_js_1 = __importDefault(require("./features/insertInto.js"));
const update_js_1 = __importDefault(require("./features/update.js"));
const truncateTable_js_1 = __importDefault(require("./features/truncateTable.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const onConflict_js_1 = __importDefault(require("./features/onConflict.js"));
const isDistinctFrom_js_1 = __importDefault(require("./features/isDistinctFrom.js"));
const arrayLiterals_js_1 = __importDefault(require("./features/arrayLiterals.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('PostgreSqlFormatter', () => {
    const language = 'postgresql';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeSqlFormatter_js_1.default)(format);
    (0, comments_js_1.default)(format, { nestedBlockComments: true });
    (0, commentOn_js_1.default)(format);
    (0, createView_js_1.default)(format, { orReplace: true, materialized: true, ifNotExists: true });
    (0, createTable_js_1.default)(format, { ifNotExists: true });
    (0, dropTable_js_1.default)(format, { ifExists: true });
    (0, constraints_js_1.default)(format, ['NO ACTION', 'RESTRICT', 'CASCADE', 'SET NULL', 'SET DEFAULT']);
    (0, arrayLiterals_js_1.default)(format, { withArrayPrefix: true });
    (0, arrayAndMapAccessors_js_1.default)(format);
    (0, alterTable_js_1.default)(format, {
        addColumn: true,
        dropColumn: true,
        renameTo: true,
        renameColumn: true,
    });
    (0, deleteFrom_js_1.default)(format);
    (0, insertInto_js_1.default)(format);
    (0, onConflict_js_1.default)(format);
    (0, update_js_1.default)(format, { whereCurrentOf: true });
    (0, truncateTable_js_1.default)(format, { withoutTable: true });
    (0, strings_js_1.default)(format, ["''-qq", "U&''", "X''", "B''"]);
    (0, identifiers_js_1.default)(format, [`""-qq`, 'U&""']);
    (0, between_js_1.default)(format);
    (0, schema_js_1.default)(format);
    // Missing: '::' type cast (tested separately)
    (0, operators_js_1.default)(format, [
        // Arithmetic
        '%',
        '^',
        '|/',
        '||/',
        '@',
        // Assignment
        ':=',
        // Bitwise
        '&',
        '|',
        '#',
        '~',
        '<<',
        '>>',
        // Byte comparison
        '~>~',
        '~<~',
        '~>=~',
        '~<=~',
        // Geometric
        '@-@',
        '@@',
        '##',
        '<->',
        '&&',
        '&<',
        '&>',
        '<<|',
        '&<|',
        '|>>',
        '|&>',
        '<^',
        '^>',
        '?#',
        '?-',
        '?|',
        '?-|',
        '?||',
        '@>',
        '<@',
        '~=',
        // JSON
        '?',
        '@?',
        '?&',
        '->',
        '->>',
        '#>',
        '#>>',
        '#-',
        // Named function params
        '=>',
        // Network address
        '>>=',
        '<<=',
        // Pattern matching
        '~~',
        '~~*',
        '!~~',
        '!~~*',
        // POSIX RegExp
        '~',
        '~*',
        '!~',
        '!~*',
        // Range/multirange
        '-|-',
        // String concatenation
        '||',
        // Text search
        '@@@',
        '!!',
        '^@',
        // Trigram/trigraph
        '<%',
        '<<%',
        '%>',
        '%>>',
        '<<->',
        '<->>',
        '<<<->',
        '<->>>',
        // Custom operators: from pgvector extension
        '<#>',
        '<=>',
        '<+>',
        '<~>',
        '<%>',
    ], { any: true });
    (0, isDistinctFrom_js_1.default)(format);
    (0, join_js_1.default)(format);
    (0, setOperations_js_1.default)(format);
    (0, returning_js_1.default)(format);
    (0, param_js_1.default)(format, { numbered: ['$'] });
    (0, window_js_1.default)(format);
    (0, limiting_js_1.default)(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });
    (0, dataTypeCase_js_1.default)(format);
    it('allows $ character as part of identifiers', () => {
        expect(format('SELECT foo$, some$$ident')).toBe((0, dedent_js_1.default) `
      SELECT
        foo$,
        some$$ident
    `);
    });
    // Postgres-specific string types
    it("supports E'' strings with C-style escapes", () => {
        expect(format("E'blah blah'")).toBe("E'blah blah'");
        expect(format("E'some \\' FROM escapes'")).toBe("E'some \\' FROM escapes'");
        expect(format("SELECT E'blah' FROM foo")).toBe((0, dedent_js_1.default) `
      SELECT
        E'blah'
      FROM
        foo
    `);
        expect(format("E'blah''blah'")).toBe("E'blah''blah'");
    });
    it('supports dollar-quoted strings', () => {
        expect(format('$xxx$foo $$ LEFT JOIN $yyy$ bar$xxx$')).toBe('$xxx$foo $$ LEFT JOIN $yyy$ bar$xxx$');
        expect(format('$$foo JOIN bar$$')).toBe('$$foo JOIN bar$$');
        expect(format('$$foo $ JOIN bar$$')).toBe('$$foo $ JOIN bar$$');
        expect(format('$$foo \n bar$$')).toBe('$$foo \n bar$$');
        expect(format('SELECT $$where$$ FROM $$update$$')).toBe((0, dedent_js_1.default) `
      SELECT
        $$where$$
      FROM
        $$update$$
    `);
    });
    it('formats type-cast operator without spaces', () => {
        expect(format('SELECT 2 :: numeric AS foo;')).toBe((0, dedent_js_1.default) `
      SELECT
        2::numeric AS foo;
    `);
    });
    // issue #144 (unsolved)
    // This is currently far from ideal.
    it('formats SELECT DISTINCT ON () syntax', () => {
        expect(format('SELECT DISTINCT ON (c1, c2) c1, c2 FROM tbl;')).toBe((0, dedent_js_1.default) `
      SELECT DISTINCT
        ON (c1, c2) c1,
        c2
      FROM
        tbl;
    `);
    });
    // Regression test for issue #447
    it('formats empty SELECT', () => {
        expect(format('SELECT;')).toBe((0, dedent_js_1.default) `
      SELECT;
    `);
    });
    // Regression test for issues #391 and #618
    it('formats TIMESTAMP WITH TIME ZONE syntax', () => {
        expect(format(`
        CREATE TABLE time_table (id INT,
          created_at TIMESTAMP WITH TIME ZONE,
          deleted_at TIME WITH TIME ZONE,
          modified_at TIMESTAMP(0) WITH TIME ZONE);`)).toBe((0, dedent_js_1.default) `
      CREATE TABLE time_table (
        id INT,
        created_at TIMESTAMP WITH TIME ZONE,
        deleted_at TIME WITH TIME ZONE,
        modified_at TIMESTAMP(0) WITH TIME ZONE
      );
    `);
    });
    // Regression test for issue #624
    it('supports array slice operator', () => {
        expect(format('SELECT foo[:5], bar[1:], baz[1:5], zap[:];')).toBe((0, dedent_js_1.default) `
      SELECT
        foo[:5],
        bar[1:],
        baz[1:5],
        zap[:];
    `);
    });
    it('formats ALTER TABLE ... ALTER COLUMN', () => {
        expect(format(`ALTER TABLE t ALTER COLUMN foo SET DATA TYPE VARCHAR;
         ALTER TABLE t ALTER COLUMN foo SET DEFAULT 5;
         ALTER TABLE t ALTER COLUMN foo DROP DEFAULT;
         ALTER TABLE t ALTER COLUMN foo SET NOT NULL;
         ALTER TABLE t ALTER COLUMN foo DROP NOT NULL;`)).toBe((0, dedent_js_1.default) `
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
    `);
    });
    it('formats FOR UPDATE clause', () => {
        expect(format(`
        SELECT * FROM tbl FOR UPDATE;
        SELECT * FROM tbl FOR UPDATE OF tbl.salary;
      `)).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        tbl
      FOR UPDATE;

      SELECT
        *
      FROM
        tbl
      FOR UPDATE OF
        tbl.salary;
    `);
    });
    // Issue #685
    it('allows TYPE to be used as an identifier', () => {
        expect(format(`SELECT type, modified_at FROM items;`)).toBe((0, dedent_js_1.default) `
      SELECT
        type,
        modified_at
      FROM
        items;
    `);
    });
    // Issue #156, #709
    it('does not recognize common fields names as keywords', () => {
        expect(format(`SELECT id, type, name, location, label, password FROM release;`, {
            keywordCase: 'upper',
        })).toBe((0, dedent_js_1.default) `
      SELECT
        id,
        type,
        name,
        location,
        label,
        password
      FROM
        release;
    `);
    });
    it('formats DEFAULT VALUES clause', () => {
        expect(format(`INSERT INTO items default values RETURNING id;`, {
            keywordCase: 'upper',
        })).toBe((0, dedent_js_1.default) `
      INSERT INTO
        items
      DEFAULT VALUES
      RETURNING
        id;
    `);
    });
    // Issue #726
    it('treats TEXT as data-type (not as plain keyword)', () => {
        expect(format(`CREATE TABLE foo (items text);`, {
            dataTypeCase: 'upper',
        })).toBe((0, dedent_js_1.default) `
      CREATE TABLE foo (items TEXT);
    `);
        expect(format(`CREATE TABLE foo (text VARCHAR(100));`, {
            keywordCase: 'upper',
        })).toBe((0, dedent_js_1.default) `
      CREATE TABLE foo (text VARCHAR(100));
    `);
    });
    // Issue #711
    it('supports OPERATOR() syntax', () => {
        expect(format(`SELECT foo OPERATOR(public.===) bar;`)).toBe((0, dedent_js_1.default) `
      SELECT
        foo OPERATOR(public.===) bar;
    `);
        expect(format(`SELECT foo operator ( !== ) bar;`)).toBe((0, dedent_js_1.default) `
      SELECT
        foo operator ( !== ) bar;
    `);
    });
    // Issue #813
    it('supports OR REPLACE in CREATE FUNCTION', () => {
        expect(format(`CREATE OR REPLACE FUNCTION foo ();`)).toBe((0, dedent_js_1.default) `
      CREATE OR REPLACE FUNCTION foo ();
    `);
    });
});
//# sourceMappingURL=postgresql.test.js.map