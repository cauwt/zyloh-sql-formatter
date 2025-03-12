"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsCreateView;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsCreateView(format, { orReplace, materialized, ifNotExists } = {}) {
    it('formats CREATE VIEW', () => {
        expect(format('CREATE VIEW my_view AS SELECT id, fname, lname FROM tbl;')).toBe((0, dedent_js_1.default) `
      CREATE VIEW my_view AS
      SELECT
        id,
        fname,
        lname
      FROM
        tbl;
    `);
    });
    it('formats CREATE VIEW with columns', () => {
        expect(format('CREATE VIEW my_view (id, fname, lname) AS SELECT * FROM tbl;')).toBe((0, dedent_js_1.default) `
      CREATE VIEW my_view (id, fname, lname) AS
      SELECT
        *
      FROM
        tbl;
    `);
    });
    if (orReplace) {
        it('formats CREATE OR REPLACE VIEW', () => {
            expect(format('CREATE OR REPLACE VIEW v1 AS SELECT 42;')).toBe((0, dedent_js_1.default) `
        CREATE OR REPLACE VIEW v1 AS
        SELECT
          42;
      `);
        });
    }
    if (materialized) {
        it('formats CREATE MATERIALIZED VIEW', () => {
            expect(format('CREATE MATERIALIZED VIEW mat_view AS SELECT 42;')).toBe((0, dedent_js_1.default) `
        CREATE MATERIALIZED VIEW mat_view AS
        SELECT
          42;
      `);
        });
    }
    if (ifNotExists) {
        it('formats short CREATE VIEW IF NOT EXISTS', () => {
            expect(format('CREATE VIEW IF NOT EXISTS my_view AS SELECT 42;')).toBe((0, dedent_js_1.default) `
        CREATE VIEW IF NOT EXISTS my_view AS
        SELECT
          42;
      `);
        });
    }
}
//# sourceMappingURL=createView.js.map