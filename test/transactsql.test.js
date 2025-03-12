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
const strings_js_1 = __importDefault(require("./features/strings.js"));
const between_js_1 = __importDefault(require("./features/between.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
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
const mergeInto_js_1 = __importDefault(require("./features/mergeInto.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('TransactSqlFormatter', () => {
    const language = 'transactsql';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeSqlFormatter_js_1.default)(format);
    (0, comments_js_1.default)(format, { nestedBlockComments: true });
    (0, createView_js_1.default)(format, { materialized: true });
    (0, createTable_js_1.default)(format);
    (0, dropTable_js_1.default)(format, { ifExists: true });
    (0, constraints_js_1.default)(format, ['SET NULL', 'SET DEFAULT', 'CASCADE', 'NO ACTION']);
    (0, alterTable_js_1.default)(format, {
        dropColumn: true,
    });
    (0, deleteFrom_js_1.default)(format);
    (0, insertInto_js_1.default)(format, { withoutInto: true });
    (0, update_js_1.default)(format, { whereCurrentOf: true });
    (0, truncateTable_js_1.default)(format);
    (0, mergeInto_js_1.default)(format);
    (0, strings_js_1.default)(format, ["N''", "''-qq"]);
    (0, identifiers_js_1.default)(format, [`""-qq`, '[]']);
    (0, between_js_1.default)(format);
    // Missing: `::` scope resolution operator (tested separately)
    (0, operators_js_1.default)(format, ['%', '&', '|', '^', '~', '!<', '!>', '+=', '-=', '*=', '/=', '%=', '|=', '&=', '^='], { any: true });
    (0, join_js_1.default)(format, { without: ['NATURAL'], supportsUsing: false, supportsApply: true });
    (0, setOperations_js_1.default)(format, ['UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT']);
    (0, param_js_1.default)(format, { named: ['@'], quoted: ['@""', '@[]'] });
    (0, window_js_1.default)(format);
    (0, limiting_js_1.default)(format, { offset: true, fetchFirst: true, fetchNext: true });
    (0, dataTypeCase_js_1.default)(format);
    it('supports language:tsql alias', () => {
        const result = (0, sqlFormatter_js_1.format)('SELECT [my column] FROM [my table];', { language: 'tsql' });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        [my column]
      FROM
        [my table];
    `);
    });
    it('recognizes @, $, # as part of identifiers', () => {
        const result = format('SELECT from@bar, where#to, join$me FROM tbl;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        from@bar,
        where#to,
        join$me
      FROM
        tbl;
    `);
    });
    it('allows @ and # at the start of identifiers', () => {
        const result = format('SELECT @bar, #baz, @@some, ##flam FROM tbl;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        @bar,
        #baz,
        @@some,
        ##flam
      FROM
        tbl;
    `);
    });
    it('formats scope resolution operator without spaces', () => {
        expect(format('SELECT hierarchyid :: GetRoot();')).toBe((0, dedent_js_1.default) `
      SELECT
        hierarchyid::GetRoot ();
    `);
    });
    it('formats .. shorthand for database.schema.table', () => {
        expect(format('SELECT x FROM db..tbl')).toBe((0, dedent_js_1.default) `
      SELECT
        x
      FROM
        db..tbl
    `);
    });
    it('formats ALTER TABLE ... ALTER COLUMN', () => {
        expect(format(`ALTER TABLE t ALTER COLUMN foo INT NOT NULL DEFAULT 5;`)).toBe((0, dedent_js_1.default) `
      ALTER TABLE t
      ALTER COLUMN foo INT NOT NULL DEFAULT 5;
    `);
    });
    it('formats GO CREATE OR ALTER PROCEDURE', () => {
        const result = format('GO CREATE OR ALTER PROCEDURE p');
        expect(result).toBe((0, dedent_js_1.default) `
      GO
      CREATE OR ALTER PROCEDURE
        p
    `);
    });
    it('formats SELECT ... INTO clause', () => {
        const result = format('SELECT col INTO #temp FROM tbl');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        col
      INTO
        #temp
      FROM
        tbl
    `);
    });
    it('formats SELECT ... OPTION ()', () => {
        const result = format('SELECT col OPTION (MAXRECURSION 5)');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        col
      OPTION
        (MAXRECURSION 5)
    `);
    });
    it('formats SELECT ... FOR BROWSE', () => {
        expect(format('SELECT col FOR BROWSE')).toBe((0, dedent_js_1.default) `
      SELECT
        col
      FOR BROWSE
    `);
    });
    it('formats SELECT ... FOR XML', () => {
        expect(format("SELECT col FOR XML PATH('Employee'), ROOT('Employees')")).toBe((0, dedent_js_1.default) `
      SELECT
        col
      FOR XML
        PATH ('Employee'),
        ROOT ('Employees')
    `);
    });
    it('formats SELECT ... FOR JSON', () => {
        expect(format('SELECT col FOR JSON PATH, WITHOUT_ARRAY_WRAPPER')).toBe((0, dedent_js_1.default) `
      SELECT
        col
      FOR JSON
        PATH,
        WITHOUT_ARRAY_WRAPPER
    `);
    });
    it('formats goto labels', () => {
        const result = format(`InfiniLoop:
      SELECT 'Hello.';
      GOTO InfiniLoop;`);
        expect(result).toBe((0, dedent_js_1.default) `
      InfiniLoop:
      SELECT
        'Hello.';

      GOTO InfiniLoop;
    `);
    });
    // Issue #811
    it('does not detect CHAR() as function', () => {
        expect(format(`CREATE TABLE foo (name char(65));`, { functionCase: 'upper' })).toBe((0, dedent_js_1.default) `
      CREATE TABLE foo (name char(65));
    `);
    });
    // Issue #810
    it('supports special $ACTION keyword', () => {
        expect(format(`MERGE INTO tbl OUTPUT $action AS act;`)).toBe((0, dedent_js_1.default) `
      MERGE INTO
        tbl OUTPUT $action AS act;
    `);
    });
    // Issue #814
    it('formats GO on a separate line', () => {
        expect(format(`CREATE VIEW foo AS SELECT * FROM tbl GO CREATE INDEX bar`)).toBe((0, dedent_js_1.default) `
      CREATE VIEW foo AS
      SELECT
        *
      FROM
        tbl
      GO
      CREATE INDEX bar
    `);
    });
    // Issue #819
    it('does not recognize ODBC keywords as reserved keywords', () => {
        expect(format(`SELECT Value, Zone`, { keywordCase: 'upper' })).toBe((0, dedent_js_1.default) `
      SELECT
        Value,
        Zone
    `);
    });
});
//# sourceMappingURL=transactsql.test.js.map