"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsArrayLiterals;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsArrayLiterals(format, cfg = {}) {
    if (cfg.withArrayPrefix) {
        it('supports ARRAY[] literals', () => {
            expect(format(`SELECT ARRAY[1, 2, 3] FROM ARRAY['come-on', 'seriously', 'this', 'is', 'a', 'very', 'very', 'long', 'array'];`)).toBe((0, dedent_js_1.default) `
        SELECT
          ARRAY[1, 2, 3]
        FROM
          ARRAY[
            'come-on',
            'seriously',
            'this',
            'is',
            'a',
            'very',
            'very',
            'long',
            'array'
          ];
      `);
        });
        it('dataTypeCase option does NOT affect ARRAY[] literal case', () => {
            expect(format(`SELECT ArrAy[1, 2]`, {
                dataTypeCase: 'upper',
            })).toBe((0, dedent_js_1.default) `
        SELECT
          ArrAy[1, 2]
      `);
        });
        it('keywordCase option affects ARRAY[] literal case', () => {
            expect(format(`SELECT ArrAy[1, 2]`, {
                keywordCase: 'upper',
            })).toBe((0, dedent_js_1.default) `
        SELECT
          ARRAY[1, 2]
      `);
        });
        it('dataTypeCase option affects ARRAY type case', () => {
            expect(format(`CREATE TABLE foo ( items ArrAy )`, {
                dataTypeCase: 'upper',
            })).toBe((0, dedent_js_1.default) `
        CREATE TABLE foo (items ARRAY)
      `);
        });
    }
    if (cfg.withoutArrayPrefix) {
        it('supports array literals', () => {
            expect(format(`SELECT [1, 2, 3] FROM ['come-on', 'seriously', 'this', 'is', 'a', 'very', 'very', 'long', 'array'];`)).toBe((0, dedent_js_1.default) `
        SELECT
          [1, 2, 3]
        FROM
          [
            'come-on',
            'seriously',
            'this',
            'is',
            'a',
            'very',
            'very',
            'long',
            'array'
          ];
      `);
        });
    }
}
//# sourceMappingURL=arrayLiterals.js.map