"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsAlterTable;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsAlterTable(format, cfg = {}) {
    if (cfg.addColumn) {
        it('formats ALTER TABLE ... ADD COLUMN query', () => {
            const result = format('ALTER TABLE supplier ADD COLUMN unit_price DECIMAL NOT NULL;');
            expect(result).toBe((0, dedent_js_1.default) `
        ALTER TABLE supplier
        ADD COLUMN unit_price DECIMAL NOT NULL;
      `);
        });
    }
    if (cfg.dropColumn) {
        it('formats ALTER TABLE ... DROP COLUMN query', () => {
            const result = format('ALTER TABLE supplier DROP COLUMN unit_price;');
            expect(result).toBe((0, dedent_js_1.default) `
        ALTER TABLE supplier
        DROP COLUMN unit_price;
      `);
        });
    }
    if (cfg.modify) {
        it('formats ALTER TABLE ... MODIFY statement', () => {
            const result = format('ALTER TABLE supplier MODIFY supplier_id DECIMAL NULL;');
            expect(result).toBe((0, dedent_js_1.default) `
        ALTER TABLE supplier
        MODIFY supplier_id DECIMAL NULL;
      `);
        });
    }
    if (cfg.renameTo) {
        it('formats ALTER TABLE ... RENAME TO statement', () => {
            const result = format('ALTER TABLE supplier RENAME TO the_one_who_supplies;');
            expect(result).toBe((0, dedent_js_1.default) `
        ALTER TABLE supplier
        RENAME TO the_one_who_supplies;
      `);
        });
    }
    if (cfg.renameColumn) {
        it('formats ALTER TABLE ... RENAME COLUMN statement', () => {
            const result = format('ALTER TABLE supplier RENAME COLUMN supplier_id TO id;');
            expect(result).toBe((0, dedent_js_1.default) `
        ALTER TABLE supplier
        RENAME COLUMN supplier_id TO id;
      `);
        });
    }
}
//# sourceMappingURL=alterTable.js.map