"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsComments;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsComments(format, opts = {}) {
    it('formats SELECT query with different comments', () => {
        const result = format((0, dedent_js_1.default) `
      SELECT
      /*
       * This is a block comment
       */
      * FROM
      -- This is another comment
      MyTable -- One final comment
      WHERE 1 = 2;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        /*
         * This is a block comment
         */
        *
      FROM
        -- This is another comment
        MyTable -- One final comment
      WHERE
        1 = 2;
    `);
    });
    it('maintains block comment indentation', () => {
        const sql = (0, dedent_js_1.default) `
      SELECT
        /*
         * This is a block comment
         */
        *
      FROM
        MyTable
      WHERE
        1 = 2;
    `;
        expect(format(sql)).toBe(sql);
    });
    it('keeps block comment on separate line when it is separate in original SQL', () => {
        const sql = (0, dedent_js_1.default) `
      SELECT
        /* separate-line block comment */
        foo,
        bar /* inline block comment */
      FROM
        tbl;
    `;
        expect(format(sql)).toBe(sql);
    });
    it('formats tricky line comments', () => {
        expect(format('SELECT a--comment, here\nFROM b--comment')).toBe((0, dedent_js_1.default) `
      SELECT
        a --comment, here
      FROM
        b --comment
    `);
    });
    it('formats line comments followed by semicolon', () => {
        expect(format(`
      SELECT a FROM b --comment
      ;
    `)).toBe((0, dedent_js_1.default) `
      SELECT
        a
      FROM
        b --comment
      ;
    `);
    });
    it('formats line comments followed by comma', () => {
        expect(format((0, dedent_js_1.default) `
      SELECT a --comment
      , b
    `)).toBe((0, dedent_js_1.default) `
      SELECT
        a --comment
      ,
        b
    `);
    });
    it('formats line comments followed by close-paren', () => {
        expect(format('SELECT ( a --comment\n )')).toBe((0, dedent_js_1.default) `
      SELECT
        (
          a --comment
        )
    `);
    });
    it('formats line comments followed by open-paren', () => {
        expect(format('SELECT a --comment\n()')).toBe((0, dedent_js_1.default) `
      SELECT
        a --comment
        ()
    `);
    });
    // Regression test for #481
    it('formats first line comment in a file', () => {
        expect(format('-- comment1\n-- comment2\n')).toBe((0, dedent_js_1.default) `
      -- comment1
      -- comment2
    `);
    });
    it('formats first block comment in a file', () => {
        expect(format('/*comment1*/\n/*comment2*/\n')).toBe((0, dedent_js_1.default) `
      /*comment1*/
      /*comment2*/
    `);
    });
    it('preserves single-line comments at the end of lines', () => {
        expect(format(`
        SELECT
          a, --comment1
          b --comment2
        FROM --comment3
          my_table;
      `)).toBe((0, dedent_js_1.default) `
      SELECT
        a, --comment1
        b --comment2
      FROM --comment3
        my_table;
    `);
    });
    it('preserves single-line comments on separate lines', () => {
        expect(format(`
        SELECT
          --comment1
          a,
          --comment2
          b
        FROM
          --comment3
          my_table;
      `)).toBe((0, dedent_js_1.default) `
      SELECT
        --comment1
        a,
        --comment2
        b
      FROM
        --comment3
        my_table;
    `);
    });
    it('recognizes line-comments with Windows line-endings (converts them to UNIX)', () => {
        const result = format('SELECT * FROM\r\n-- line comment 1\r\nMyTable -- line comment 2\r\n');
        expect(result).toBe('SELECT\n  *\nFROM\n  -- line comment 1\n  MyTable -- line comment 2');
    });
    it('does not detect unclosed comment as a comment', () => {
        const result = format(`
      SELECT count(*)
      /*SomeComment
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        count(*) / * SomeComment
    `);
    });
    it('formats comments between function name and parenthesis', () => {
        const result = format(`
      SELECT count /* comment */ (*);
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        count/* comment */ (*);
    `);
    });
    it('formats comments between qualified.names (before dot)', () => {
        const result = format(`
      SELECT foo/* com1 */.bar, count()/* com2 */.bar, foo.bar/* com3 */.baz, (1, 2) /* com4 */.foo;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        foo /* com1 */.bar,
        count() /* com2 */.bar,
        foo.bar /* com3 */.baz,
        (1, 2) /* com4 */.foo;
    `);
    });
    // Regression test for #558
    it('indents multiline block comment that is not a doc-comment', () => {
        const result = format((0, dedent_js_1.default) `
      SELECT 1
      /*
      comment line
      */
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        1
        /*
        comment line
        */
    `);
    });
    it('formats comments between qualified.names (after dot)', () => {
        const result = format(`
      SELECT foo. /* com1 */ bar, foo. /* com2 */ *;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        foo./* com1 */ bar,
        foo./* com2 */ *;
    `);
    });
    // Regression test for #747
    it('handles block comments with /** and **/ patterns', () => {
        const sql = `/** This is a block comment **/`;
        expect(format(sql)).toBe(sql);
    });
    if (opts.hashComments) {
        it('supports # line comment', () => {
            const result = format('SELECT alpha # commment\nFROM beta');
            expect(result).toBe((0, dedent_js_1.default) `
        SELECT
          alpha # commment
        FROM
          beta
      `);
        });
    }
    if (opts.doubleSlashComments) {
        it('supports // line comment', () => {
            const result = format('SELECT alpha // commment\nFROM beta');
            expect(result).toBe((0, dedent_js_1.default) `
        SELECT
          alpha // commment
        FROM
          beta
      `);
        });
    }
    if (opts.nestedBlockComments) {
        it('supports nested block comments', () => {
            const result = format('SELECT alpha /* /* commment */ */ FROM beta');
            expect(result).toBe((0, dedent_js_1.default) `
        SELECT
          alpha /* /* commment */ */
        FROM
          beta
      `);
        });
    }
}
//# sourceMappingURL=comments.js.map