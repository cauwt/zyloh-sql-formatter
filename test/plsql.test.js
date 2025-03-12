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
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const insertInto_js_1 = __importDefault(require("./features/insertInto.js"));
const update_js_1 = __importDefault(require("./features/update.js"));
const truncateTable_js_1 = __importDefault(require("./features/truncateTable.js"));
const mergeInto_js_1 = __importDefault(require("./features/mergeInto.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('PlSqlFormatter', () => {
    const language = 'plsql';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeSqlFormatter_js_1.default)(format);
    (0, comments_js_1.default)(format);
    (0, commentOn_js_1.default)(format);
    (0, createView_js_1.default)(format, { orReplace: true, materialized: true });
    (0, createTable_js_1.default)(format);
    (0, dropTable_js_1.default)(format);
    // http://dba-oracle.com/bk_on_delete_restrict_on_delete_no_action_tips.htm
    (0, constraints_js_1.default)(format, ['SET NULL', 'CASCADE', 'NO ACTION']);
    (0, alterTable_js_1.default)(format, {
        dropColumn: true,
        modify: true,
        renameTo: true,
        renameColumn: true,
    });
    (0, deleteFrom_js_1.default)(format);
    (0, insertInto_js_1.default)(format);
    (0, update_js_1.default)(format);
    (0, truncateTable_js_1.default)(format);
    (0, mergeInto_js_1.default)(format);
    (0, strings_js_1.default)(format, ["''-qq", "N''"]);
    (0, identifiers_js_1.default)(format, [`""-qq`]);
    (0, between_js_1.default)(format);
    (0, schema_js_1.default)(format);
    (0, operators_js_1.default)(format, 
    // Missing: '..' operator
    ['**', ':=', '%', '~=', '^=', '>>', '<<', '=>', '||'], {
        logicalOperators: ['AND', 'OR', 'XOR'],
        any: true,
    });
    (0, join_js_1.default)(format, { supportsApply: true });
    (0, setOperations_js_1.default)(format, ['UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT']);
    (0, returning_js_1.default)(format);
    (0, param_js_1.default)(format, { numbered: [':'], named: [':'] });
    (0, limiting_js_1.default)(format, { offset: true, fetchFirst: true, fetchNext: true });
    (0, dataTypeCase_js_1.default)(format);
    it('recognizes _, $, # as part of identifiers', () => {
        const result = format('SELECT my_col$1#, col.a$, type#, procedure$, user# FROM tbl;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        my_col$1#,
        col.a$,
        type#,
        procedure$,
        user#
      FROM
        tbl;
    `);
    });
    // Parameters don't allow the same characters as identifiers
    it('does not support #, $ in named parameters', () => {
        expect(() => format('SELECT :col$foo')).toThrowError(`Parse error: Unexpected "$foo"`);
        expect(() => format('SELECT :col#foo')).toThrowError(`Parse error: Unexpected "#foo"`);
    });
    it('supports &name substitution variables', () => {
        const result = format('SELECT &name, &some$Special#Chars_, &hah123 FROM &&tbl');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        &name,
        &some$Special#Chars_,
        &hah123
      FROM
        &&tbl
    `);
    });
    it('supports Q custom delimiter strings', () => {
        expect(format("q'<test string < > 'foo' bar >'")).toBe("q'<test string < > 'foo' bar >'");
        expect(format("NQ'[test string [ ] 'foo' bar ]'")).toBe("NQ'[test string [ ] 'foo' bar ]'");
        expect(format("nq'(test string ( ) 'foo' bar )'")).toBe("nq'(test string ( ) 'foo' bar )'");
        expect(format("nQ'{test string { } 'foo' bar }'")).toBe("nQ'{test string { } 'foo' bar }'");
        expect(format("Nq'%test string % % 'foo' bar %'")).toBe("Nq'%test string % % 'foo' bar %'");
        expect(format("Q'Xtest string X X 'foo' bar X'")).toBe("Q'Xtest string X X 'foo' bar X'");
        expect(() => format("q'$test string $'$''")).toThrowError(`Parse error: Unexpected "$''"`);
        expect(format("Q'Stest string S'S''")).toBe("Q'Stest string S' S ''");
    });
    it('formats Oracle recursive sub queries', () => {
        const result = format(`
      WITH t1 AS (
        SELECT * FROM tbl
      ) SEARCH BREADTH FIRST BY id SET order1
      SELECT * FROM t1;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      WITH
        t1 AS (
          SELECT
            *
          FROM
            tbl
        ) SEARCH BREADTH FIRST BY id SET order1
      SELECT
        *
      FROM
        t1;
    `);
    });
    // regression test for sql-formatter#338
    it('formats identifier with dblink', () => {
        const result = format('SELECT * FROM database.table@dblink WHERE id = 1;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        database.table@dblink
      WHERE
        id = 1;
    `);
    });
    // regression test for #340
    it('formats FOR UPDATE clause', () => {
        const result = format(`
      SELECT * FROM tbl FOR UPDATE;
      SELECT * FROM tbl FOR UPDATE OF tbl.salary;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
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
});
//# sourceMappingURL=plsql.test.js.map