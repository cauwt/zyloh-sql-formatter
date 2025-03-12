"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsLinesBetweenQueries;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsLinesBetweenQueries(format) {
    it('defaults to single empty line between queries', () => {
        const result = format('SELECT * FROM foo; SELECT * FROM bar;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        foo;

      SELECT
        *
      FROM
        bar;
    `);
    });
    it('supports more empty lines between queries', () => {
        const result = format('SELECT * FROM foo; SELECT * FROM bar;', { linesBetweenQueries: 2 });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        foo;


      SELECT
        *
      FROM
        bar;
    `);
    });
    it('supports no empty lines between queries', () => {
        const result = format('SELECT * FROM foo; SELECT * FROM bar;', { linesBetweenQueries: 0 });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        foo;
      SELECT
        *
      FROM
        bar;
    `);
    });
}
//# sourceMappingURL=linesBetweenQueries.js.map