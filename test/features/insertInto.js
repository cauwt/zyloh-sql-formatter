"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsInsertInto;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsInsertInto(format, { withoutInto } = {}) {
    it('formats simple INSERT INTO', () => {
        const result = format("INSERT INTO Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');");
        expect(result).toBe((0, dedent_js_1.default) `
      INSERT INTO
        Customers (ID, MoneyBalance, Address, City)
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `);
    });
    if (withoutInto) {
        it('formats INSERT without INTO', () => {
            const result = format("INSERT Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');");
            expect(result).toBe((0, dedent_js_1.default) `
        INSERT
          Customers (ID, MoneyBalance, Address, City)
        VALUES
          (12, -123.4, 'Skagen 2111', 'Stv');
      `);
        });
    }
}
//# sourceMappingURL=insertInto.js.map