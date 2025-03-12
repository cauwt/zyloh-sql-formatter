"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsUpdate;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsUpdate(format, { whereCurrentOf } = {}) {
    it('formats simple UPDATE statement', () => {
        const result = format("UPDATE Customers SET ContactName='Alfred Schmidt', City='Hamburg' WHERE CustomerName='Alfreds Futterkiste';");
        expect(result).toBe((0, dedent_js_1.default) `
      UPDATE Customers
      SET
        ContactName = 'Alfred Schmidt',
        City = 'Hamburg'
      WHERE
        CustomerName = 'Alfreds Futterkiste';
    `);
    });
    it('formats UPDATE statement with AS part', () => {
        const result = format('UPDATE customers SET total_orders = order_summary.total  FROM ( SELECT * FROM bank) AS order_summary');
        expect(result).toBe((0, dedent_js_1.default) `
      UPDATE customers
      SET
        total_orders = order_summary.total
      FROM
        (
          SELECT
            *
          FROM
            bank
        ) AS order_summary
    `);
    });
    if (whereCurrentOf) {
        it('formats UPDATE statement with cursor position', () => {
            const result = format("UPDATE Customers SET Name='John' WHERE CURRENT OF my_cursor;");
            expect(result).toBe((0, dedent_js_1.default) `
        UPDATE Customers
        SET
          Name = 'John'
        WHERE CURRENT OF my_cursor;
      `);
        });
    }
}
//# sourceMappingURL=update.js.map