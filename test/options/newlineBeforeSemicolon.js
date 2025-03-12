"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsNewlineBeforeSemicolon;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsNewlineBeforeSemicolon(format) {
    it('formats lonely semicolon', () => {
        expect(format(';')).toBe(';');
    });
    it('does not add newline before lonely semicolon when newlineBeforeSemicolon:true', () => {
        expect(format(';', { newlineBeforeSemicolon: true })).toBe(';');
    });
    it('defaults to semicolon on end of last line', () => {
        const result = format(`SELECT a FROM b;`);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        a
      FROM
        b;
    `);
    });
    // A regression test for semicolon placement in single-line clauses like:
    //
    //   ALTER TABLE
    //     my_table
    //   ALTER COLUMN
    //     foo
    //   DROP DEFAULT;  <-- here
    //
    // Unfortunately there's really no such single-line clause that exists in all dialects,
    // so our test resorts to using somewhat invalid SQL.
    it('places semicolon on the same line as a single-line clause', () => {
        const result = format(`SELECT a FROM;`);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        a
      FROM;
    `);
    });
    it('supports semicolon on separate line', () => {
        const result = format(`SELECT a FROM b;`, { newlineBeforeSemicolon: true });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        a
      FROM
        b
      ;
    `);
    });
    // the nr of empty lines here depends on linesBetweenQueries option
    it('formats multiple lonely semicolons', () => {
        expect(format(';;;')).toBe((0, dedent_js_1.default) `
      ;

      ;

      ;
    `);
    });
    it('does not introduce extra empty lines between semicolons when newlineBeforeSemicolon:true', () => {
        expect(format(';;;', { newlineBeforeSemicolon: true })).toBe((0, dedent_js_1.default) `
      ;

      ;

      ;
    `);
    });
}
//# sourceMappingURL=newlineBeforeSemicolon.js.map