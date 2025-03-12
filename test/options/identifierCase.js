"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsIdentifierCase;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsIdentifierCase(format) {
    it('preserves identifier case by default', () => {
        const result = format((0, dedent_js_1.default) `
        select Abc, 'mytext' as MyText from tBl1 left join Tbl2 where colA > 1 and colB = 3`);
        expect(result).toBe((0, dedent_js_1.default) `
      select
        Abc,
        'mytext' as MyText
      from
        tBl1
        left join Tbl2
      where
        colA > 1
        and colB = 3
    `);
    });
    it('converts identifiers to uppercase', () => {
        const result = format((0, dedent_js_1.default) `
        select Abc, 'mytext' as MyText from tBl1 left join Tbl2 where colA > 1 and colB = 3`, { identifierCase: 'upper' });
        expect(result).toBe((0, dedent_js_1.default) `
      select
        ABC,
        'mytext' as MYTEXT
      from
        TBL1
        left join TBL2
      where
        COLA > 1
        and COLB = 3
    `);
    });
    it('converts identifiers to lowercase', () => {
        const result = format((0, dedent_js_1.default) `
        select Abc, 'mytext' as MyText from tBl1 left join Tbl2 where colA > 1 and colB = 3`, { identifierCase: 'lower' });
        expect(result).toBe((0, dedent_js_1.default) `
      select
        abc,
        'mytext' as mytext
      from
        tbl1
        left join tbl2
      where
        cola > 1
        and colb = 3
    `);
    });
    it('does not uppercase quoted identifiers', () => {
        const result = format(`select "abc" as foo`, {
            identifierCase: 'upper',
        });
        expect(result).toBe((0, dedent_js_1.default) `
      select
        "abc" as FOO
    `);
    });
    it('converts multi-part identifiers to uppercase', () => {
        const result = format('select Abc from Part1.Part2.Part3', { identifierCase: 'upper' });
        expect(result).toBe((0, dedent_js_1.default) `
      select
        ABC
      from
        PART1.PART2.PART3
    `);
    });
    it('function names are not effected by identifierCase option', () => {
        const result = format('select count(*) from tbl', { identifierCase: 'upper' });
        expect(result).toBe((0, dedent_js_1.default) `
      select
        count(*)
      from
        TBL
    `);
    });
}
//# sourceMappingURL=identifierCase.js.map