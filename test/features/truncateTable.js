"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsTruncateTable;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsTruncateTable(format, { withoutTable } = {}) {
    it('formats TRUNCATE TABLE statement', () => {
        const result = format('TRUNCATE TABLE Customers;');
        expect(result).toBe((0, dedent_js_1.default) `
      TRUNCATE TABLE Customers;
    `);
    });
    if (withoutTable) {
        it('formats TRUNCATE statement (without TABLE)', () => {
            const result = format('TRUNCATE Customers;');
            expect(result).toBe((0, dedent_js_1.default) `
        TRUNCATE Customers;
      `);
        });
    }
}
//# sourceMappingURL=truncateTable.js.map