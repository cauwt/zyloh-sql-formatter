"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dedent_js_1 = __importDefault(require("dedent-js"));
const sqlFormatter_js_1 = require("../src/sqlFormatter.js");
const behavesLikeSqlFormatter_js_1 = __importDefault(require("./behavesLikeSqlFormatter.js"));
const alterTable_js_1 = __importDefault(require("./features/alterTable.js"));
const commentOn_js_1 = __importDefault(require("./features/commentOn.js"));
const comments_js_1 = __importDefault(require("./features/comments.js"));
const createTable_js_1 = __importDefault(require("./features/createTable.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const deleteFrom_js_1 = __importDefault(require("./features/deleteFrom.js"));
const dropTable_js_1 = __importDefault(require("./features/dropTable.js"));
const identifiers_js_1 = __importDefault(require("./features/identifiers.js"));
const insertInto_js_1 = __importDefault(require("./features/insertInto.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const truncateTable_js_1 = __importDefault(require("./features/truncateTable.js"));
const update_js_1 = __importDefault(require("./features/update.js"));
const param_js_1 = __importDefault(require("./options/param.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('RedshiftFormatter', () => {
    const language = 'redshift';
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
    (0, deleteFrom_js_1.default)(format, { withoutFrom: true });
    (0, insertInto_js_1.default)(format);
    (0, update_js_1.default)(format);
    (0, truncateTable_js_1.default)(format, { withoutTable: true });
    (0, strings_js_1.default)(format, ["''-qq"]);
    (0, identifiers_js_1.default)(format, [`""-qq`]);
    // Missing: '#' and '::' operator (tested separately)
    (0, operators_js_1.default)(format, ['^', '%', '@', '|/', '||/', '&', '|', '~', '<<', '>>', '||'], {
        any: true,
    });
    (0, join_js_1.default)(format);
    (0, setOperations_js_1.default)(format, ['UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT', 'MINUS']);
    (0, param_js_1.default)(format, { numbered: ['$'] });
    (0, limiting_js_1.default)(format, { limit: true, offset: true });
    (0, dataTypeCase_js_1.default)(format);
    it('formats type-cast operator without spaces', () => {
        expect(format('SELECT 2 :: numeric AS foo;')).toBe((0, dedent_js_1.default) `
      SELECT
        2::numeric AS foo;
    `);
    });
    it('formats LIMIT', () => {
        expect(format('SELECT col1 FROM tbl ORDER BY col2 DESC LIMIT 10;')).toBe((0, dedent_js_1.default) `
      SELECT
        col1
      FROM
        tbl
      ORDER BY
        col2 DESC
      LIMIT
        10;
    `);
    });
    it('formats only -- as a line comment', () => {
        const result = format(`
      SELECT col FROM
      -- This is a comment
      MyTable;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        col
      FROM
        -- This is a comment
        MyTable;
    `);
    });
    // Regression test for sql-formatter#358
    it('formats temp table name starting with #', () => {
        expect(format(`CREATE TABLE #tablename AS tbl;`)).toBe((0, dedent_js_1.default) `
        CREATE TABLE #tablename AS tbl;
      `);
    });
    it('formats DISTKEY and SORTKEY after CREATE TABLE', () => {
        expect(format('CREATE TABLE items (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, d INT NOT NULL, e INT NOT NULL) DISTKEY(created_at) SORTKEY(created_at);')).toBe((0, dedent_js_1.default) `
      CREATE TABLE items (
        a INT PRIMARY KEY,
        b TEXT,
        c INT NOT NULL,
        d INT NOT NULL,
        e INT NOT NULL
      ) DISTKEY (created_at) SORTKEY (created_at);
    `);
    });
    // This is far from ideal, but at least the formatter doesn't crash :P
    it('formats COPY', () => {
        expect(format(`
        COPY schema.table
        FROM 's3://bucket/file.csv'
        IAM_ROLE 'arn:aws:iam::123456789:role/rolename'
        FORMAT AS CSV DELIMITER ',' QUOTE '"'
        REGION AS 'us-east-1'
      `)).toBe((0, dedent_js_1.default) `
      COPY schema.table
      FROM
        's3://bucket/file.csv' IAM_ROLE 'arn:aws:iam::123456789:role/rolename' FORMAT AS CSV DELIMITER ',' QUOTE '"' REGION AS 'us-east-1'
    `);
    });
    it('formats ALTER TABLE ... ALTER COLUMN', () => {
        expect(format(`ALTER TABLE t ALTER COLUMN foo TYPE VARCHAR;
         ALTER TABLE t ALTER COLUMN foo ENCODE my_encoding;`)).toBe((0, dedent_js_1.default) `
      ALTER TABLE t
      ALTER COLUMN foo
      TYPE VARCHAR;

      ALTER TABLE t
      ALTER COLUMN foo
      ENCODE my_encoding;
    `);
    });
});
//# sourceMappingURL=redshift.test.js.map