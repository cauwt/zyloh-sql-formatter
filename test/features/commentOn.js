"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsCommentOn;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsCommentOn(format) {
    it('formats COMMENT ON ...', () => {
        expect(format(`COMMENT ON TABLE my_table IS 'This is an awesome table.';`)).toBe((0, dedent_js_1.default) `
      COMMENT ON TABLE my_table IS 'This is an awesome table.';
    `);
        expect(format(`COMMENT ON COLUMN my_table.ssn IS 'Social Security Number';`)).toBe((0, dedent_js_1.default) `
      COMMENT ON COLUMN my_table.ssn IS 'Social Security Number';
    `);
    });
}
//# sourceMappingURL=commentOn.js.map