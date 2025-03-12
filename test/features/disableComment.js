"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsDisableComment;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsDisableComment(format) {
    it('does not format text between /* sql-formatter-disable */ and /* sql-formatter-enable */', () => {
        const result = format((0, dedent_js_1.default) `
      SELECT foo FROM bar;
      /* sql-formatter-disable */
      SELECT foo FROM bar;
      /* sql-formatter-enable */
      SELECT foo FROM bar;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        foo
      FROM
        bar;

      /* sql-formatter-disable */
      SELECT foo FROM bar;
      /* sql-formatter-enable */
      SELECT
        foo
      FROM
        bar;
    `);
    });
    it('does not format text after /* sql-formatter-disable */ until end of file', () => {
        const result = format((0, dedent_js_1.default) `
      SELECT foo FROM bar;
      /* sql-formatter-disable */
      SELECT foo FROM bar;

      SELECT foo FROM bar;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        foo
      FROM
        bar;

      /* sql-formatter-disable */
      SELECT foo FROM bar;

      SELECT foo FROM bar;
    `);
    });
    it('does not parse code between disable/enable comments', () => {
        const result = format((0, dedent_js_1.default) `
      SELECT /*sql-formatter-disable*/ ?!{}[] /*sql-formatter-enable*/ FROM bar;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        /*sql-formatter-disable*/ ?!{}[] /*sql-formatter-enable*/
      FROM
        bar;
    `);
    });
}
//# sourceMappingURL=disableComment.js.map