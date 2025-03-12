"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsSchema;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsSchema(format) {
    it('formats simple SET SCHEMA statements', () => {
        const result = format('SET SCHEMA schema1;');
        expect(result).toBe((0, dedent_js_1.default) `
      SET SCHEMA schema1;
    `);
    });
}
//# sourceMappingURL=schema.js.map