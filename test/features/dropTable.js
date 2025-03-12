"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsDropTable;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsDropTable(format, { ifExists } = {}) {
    it('formats DROP TABLE statement', () => {
        const result = format('DROP TABLE admin_role;');
        expect(result).toBe((0, dedent_js_1.default) `
      DROP TABLE admin_role;
    `);
    });
    if (ifExists) {
        it('formats DROP TABLE IF EXISTS statement', () => {
            const result = format('DROP TABLE IF EXISTS admin_role;');
            expect(result).toBe((0, dedent_js_1.default) `
        DROP TABLE IF EXISTS admin_role;
      `);
        });
    }
}
//# sourceMappingURL=dropTable.js.map