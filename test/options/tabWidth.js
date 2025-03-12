"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsTabWidth;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsTabWidth(format) {
    it('indents with 2 spaces by default', () => {
        const result = format('SELECT count(*),Column1 FROM Table1;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        count(*),
        Column1
      FROM
        Table1;
    `);
    });
    it('supports indenting with 4 spaces', () => {
        const result = format('SELECT count(*),Column1 FROM Table1;', {
            tabWidth: 4,
        });
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
          count(*),
          Column1
      FROM
          Table1;
    `);
    });
}
//# sourceMappingURL=tabWidth.js.map