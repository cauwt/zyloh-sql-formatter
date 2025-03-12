"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = behavesLikeMariaDbFormatter;
const dedent_js_1 = __importDefault(require("dedent-js"));
const behavesLikeSqlFormatter_js_1 = __importDefault(require("./behavesLikeSqlFormatter.js"));
const dropTable_js_1 = __importDefault(require("./features/dropTable.js"));
const between_js_1 = __importDefault(require("./features/between.js"));
const deleteFrom_js_1 = __importDefault(require("./features/deleteFrom.js"));
const comments_js_1 = __importDefault(require("./features/comments.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const identifiers_js_1 = __importDefault(require("./features/identifiers.js"));
const insertInto_js_1 = __importDefault(require("./features/insertInto.js"));
const update_js_1 = __importDefault(require("./features/update.js"));
const truncateTable_js_1 = __importDefault(require("./features/truncateTable.js"));
/**
 * Shared tests for MySQL and MariaDB
 */
function behavesLikeMariaDbFormatter(format) {
    (0, behavesLikeSqlFormatter_js_1.default)(format);
    (0, comments_js_1.default)(format, { hashComments: true });
    (0, strings_js_1.default)(format, ["''-qq", "''-bs", '""-qq', '""-bs', "X''"]);
    (0, identifiers_js_1.default)(format, ['``']);
    (0, dropTable_js_1.default)(format, { ifExists: true });
    (0, deleteFrom_js_1.default)(format);
    (0, insertInto_js_1.default)(format, { withoutInto: true });
    (0, update_js_1.default)(format);
    (0, truncateTable_js_1.default)(format, { withoutTable: true });
    (0, between_js_1.default)(format);
    it('allows $ character as part of identifiers', () => {
        expect(format('SELECT $foo, some$$ident')).toBe((0, dedent_js_1.default) `
      SELECT
        $foo,
        some$$ident
    `);
    });
    // regression test for sql-formatter#334
    it('supports identifiers that start with numbers', () => {
        expect(format('SELECT 4four, 12345e, 12e45, $567 FROM tbl')).toBe((0, dedent_js_1.default) `
        SELECT
          4four,
          12345e,
          12e45,
          $567
        FROM
          tbl
      `);
    });
    // regression test for sql-formatter#651
    it('supports unicode identifiers that start with numbers', () => {
        expect(format('SELECT 1ä FROM tbl')).toBe((0, dedent_js_1.default) `
        SELECT
          1ä
        FROM
          tbl
      `);
    });
    it('supports @variables', () => {
        expect(format('SELECT @foo, @some_long.var$with$special.chars')).toBe((0, dedent_js_1.default) `
      SELECT
        @foo,
        @some_long.var$with$special.chars
    `);
    });
    it('supports @`name` variables', () => {
        expect(format('SELECT @`baz zaz` FROM tbl;')).toBe((0, dedent_js_1.default) `
      SELECT
        @\`baz zaz\`
      FROM
        tbl;
    `);
    });
    it('supports setting variables: @var :=', () => {
        expect(format('SET @foo := 10;')).toBe((0, dedent_js_1.default) `
      SET
        @foo := 10;
    `);
    });
    it('supports setting variables: @`var` :=', () => {
        expect(format('SET @`foo` := (SELECT * FROM tbl);')).toBe((0, dedent_js_1.default) `
      SET
        @\`foo\` := (
          SELECT
            *
          FROM
            tbl
        );
    `);
    });
    it('supports @@ system variables', () => {
        const result = format('SELECT @@GLOBAL.time, @@SYSTEM.date, @@hour FROM foo;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        @@GLOBAL.time,
        @@SYSTEM.date,
        @@hour
      FROM
        foo;
    `);
    });
    // Issue #181
    it('does not wrap CHARACTER SET to multiple lines', () => {
        expect(format('ALTER TABLE t MODIFY col1 VARCHAR(50) CHARACTER SET greek')).toBe((0, dedent_js_1.default) `
      ALTER TABLE t
      MODIFY col1 VARCHAR(50) CHARACTER SET greek
    `);
    });
    it('supports REPLACE INTO syntax', () => {
        expect(format(`REPLACE INTO tbl VALUES (1,'Leopard'),(2,'Dog');`)).toBe((0, dedent_js_1.default) `
      REPLACE INTO
        tbl
      VALUES
        (1, 'Leopard'),
        (2, 'Dog');
    `);
    });
    // Issue #605
    it('supports INSERT ... ON DUPLICATE KEY UPDATE', () => {
        expect(format(`INSERT INTO customer VALUES ('John','Doe') ON DUPLICATE KEY UPDATE fname='Untitled';`)).toBe((0, dedent_js_1.default) `
      INSERT INTO
        customer
      VALUES
        ('John', 'Doe')
      ON DUPLICATE KEY UPDATE
        fname = 'Untitled';
    `);
    });
    it('supports INSERT ... ON DUPLICATE KEY UPDATE + VALUES() function', () => {
        expect(format(`INSERT INTO customer VALUES ('John','Doe') ON DUPLICATE KEY UPDATE col=VALUES(col2);`)).toBe((0, dedent_js_1.default) `
      INSERT INTO
        customer
      VALUES
        ('John', 'Doe')
      ON DUPLICATE KEY UPDATE
        col = VALUES(col2);
    `);
    });
    // Issue #629
    it('uppercases only reserved keywords', () => {
        expect(format(`create table account (id int comment 'the most important column');
        select * from mysql.user;
        insert into user (id, name) values (1, 'Blah');`, {
            keywordCase: 'upper',
            dataTypeCase: 'upper',
        })).toBe((0, dedent_js_1.default) `
      CREATE TABLE account (id INT comment 'the most important column');

      SELECT
        *
      FROM
        mysql.user;

      INSERT INTO
        user (id, name)
      VALUES
        (1, 'Blah');
    `);
    });
    // Issue #674
    it('supports *.* syntax in GRANT statement', () => {
        expect(format(`GRANT ALL ON *.* TO user2;`)).toBe((0, dedent_js_1.default) `
      GRANT ALL ON *.* TO user2;
    `);
    });
}
//# sourceMappingURL=behavesLikeMariaDbFormatter.js.map