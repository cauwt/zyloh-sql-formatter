"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsMergeInto;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsMergeInto(format) {
    it('formats MERGE INTO', () => {
        const result = format(`MERGE INTO DetailedInventory AS t
      USING Inventory AS i
      ON t.product = i.product
      WHEN MATCHED THEN
        UPDATE SET quantity = t.quantity + i.quantity
      WHEN NOT MATCHED THEN
        INSERT (product, quantity) VALUES ('Horse saddle', 12);`);
        // The indentation here is not ideal, but at least it's not a complete crap
        expect(result).toBe((0, dedent_js_1.default) `
      MERGE INTO
        DetailedInventory AS t USING Inventory AS i ON t.product = i.product
      WHEN MATCHED THEN
      UPDATE SET
        quantity = t.quantity + i.quantity
      WHEN NOT MATCHED THEN
      INSERT
        (product, quantity)
      VALUES
        ('Horse saddle', 12);
    `);
    });
}
//# sourceMappingURL=mergeInto.js.map