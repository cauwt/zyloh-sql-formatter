"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsDeleteFrom;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsDeleteFrom(format, { withoutFrom } = {}) {
    it('formats DELETE FROM statement', () => {
        const result = format("DELETE FROM Customers WHERE CustomerName='Alfred' AND Phone=5002132;");
        expect(result).toBe((0, dedent_js_1.default) `
      DELETE FROM Customers
      WHERE
        CustomerName = 'Alfred'
        AND Phone = 5002132;
    `);
    });
    if (withoutFrom) {
        it('formats DELETE statement (without FROM)', () => {
            const result = format("DELETE Customers WHERE CustomerName='Alfred';");
            expect(result).toBe((0, dedent_js_1.default) `
        DELETE Customers
        WHERE
          CustomerName = 'Alfred';
      `);
        });
    }
}
//# sourceMappingURL=deleteFrom.js.map