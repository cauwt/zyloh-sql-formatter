"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = behavesLikeDb2Formatter;
const dedent_js_1 = __importDefault(require("dedent-js"));
const behavesLikeSqlFormatter_js_1 = __importDefault(require("./behavesLikeSqlFormatter.js"));
const between_js_1 = __importDefault(require("./features/between.js"));
const schema_js_1 = __importDefault(require("./features/schema.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const constraints_js_1 = __importDefault(require("./features/constraints.js"));
const deleteFrom_js_1 = __importDefault(require("./features/deleteFrom.js"));
const commentOn_js_1 = __importDefault(require("./features/commentOn.js"));
const identifiers_js_1 = __importDefault(require("./features/identifiers.js"));
const param_js_1 = __importDefault(require("./options/param.js"));
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const insertInto_js_1 = __importDefault(require("./features/insertInto.js"));
const update_js_1 = __importDefault(require("./features/update.js"));
const truncateTable_js_1 = __importDefault(require("./features/truncateTable.js"));
const mergeInto_js_1 = __importDefault(require("./features/mergeInto.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const arrayLiterals_js_1 = __importDefault(require("./features/arrayLiterals.js"));
const arrayAndMapAccessors_js_1 = __importDefault(require("./features/arrayAndMapAccessors.js"));
/**
 * Shared tests for DB2 and DB2i
 */
function behavesLikeDb2Formatter(format) {
    (0, behavesLikeSqlFormatter_js_1.default)(format);
    (0, commentOn_js_1.default)(format);
    (0, createView_js_1.default)(format, { orReplace: true });
    (0, constraints_js_1.default)(format, ['NO ACTION', 'RESTRICT', 'CASCADE', 'SET NULL']);
    (0, deleteFrom_js_1.default)(format);
    (0, insertInto_js_1.default)(format);
    (0, update_js_1.default)(format, { whereCurrentOf: true });
    (0, truncateTable_js_1.default)(format, { withoutTable: true });
    (0, mergeInto_js_1.default)(format);
    (0, strings_js_1.default)(format, ["''-qq", "X''", "N''"]);
    (0, identifiers_js_1.default)(format, [`""-qq`]);
    (0, between_js_1.default)(format);
    (0, schema_js_1.default)(format);
    (0, setOperations_js_1.default)(format, [
        'UNION',
        'UNION ALL',
        'EXCEPT',
        'EXCEPT ALL',
        'INTERSECT',
        'INTERSECT ALL',
    ]);
    (0, param_js_1.default)(format, { positional: true, named: [':'] });
    (0, arrayLiterals_js_1.default)(format, { withArrayPrefix: true });
    (0, arrayAndMapAccessors_js_1.default)(format);
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
    // DB2-specific string types
    it('supports strings with G, GX, BX, UX prefixes', () => {
        expect(format(`SELECT G'blah blah', GX'01AC', BX'0101', UX'CCF239' FROM foo`)).toBe((0, dedent_js_1.default) `
      SELECT
        G'blah blah',
        GX'01AC',
        BX'0101',
        UX'CCF239'
      FROM
        foo
    `);
    });
    it('supports @, #, $ characters anywhere inside identifiers', () => {
        expect(format(`SELECT @foo, #bar, $zap, fo@o, ba#2, za$3`)).toBe((0, dedent_js_1.default) `
      SELECT
        @foo,
        #bar,
        $zap,
        fo@o,
        ba#2,
        za$3
    `);
    });
    it('supports @, #, $ characters in named parameters', () => {
        expect(format(`SELECT :foo@bar, :foo#bar, :foo$bar, :@zip, :#zap, :$zop`)).toBe((0, dedent_js_1.default) `
      SELECT
        :foo@bar,
        :foo#bar,
        :foo$bar,
        :@zip,
        :#zap,
        :$zop
    `);
    });
    it('supports WITH isolation level modifiers for UPDATE statement', () => {
        expect(format('UPDATE foo SET x = 10 WITH CS')).toBe((0, dedent_js_1.default) `
      UPDATE foo
      SET
        x = 10
      WITH CS
    `);
    });
    it('formats ALTER TABLE ... ALTER COLUMN', () => {
        expect(format(`ALTER TABLE t ALTER COLUMN foo SET DATA TYPE VARCHAR;
         ALTER TABLE t ALTER COLUMN foo SET NOT NULL;`)).toBe((0, dedent_js_1.default) `
      ALTER TABLE t
      ALTER COLUMN foo
      SET DATA TYPE VARCHAR;

      ALTER TABLE t
      ALTER COLUMN foo
      SET NOT NULL;
    `);
    });
}
//# sourceMappingURL=behavesLikeDb2Formatter.js.map