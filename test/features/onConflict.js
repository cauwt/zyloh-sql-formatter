"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsOnConflict;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsOnConflict(format) {
    // Regression test for issue #535
    it('supports INSERT .. ON CONFLICT syntax', () => {
        expect(format(`INSERT INTO tbl VALUES (1,'Blah') ON CONFLICT DO NOTHING;`)).toBe((0, dedent_js_1.default) `
      INSERT INTO
        tbl
      VALUES
        (1, 'Blah')
      ON CONFLICT DO NOTHING;
    `);
    });
}
//# sourceMappingURL=onConflict.js.map