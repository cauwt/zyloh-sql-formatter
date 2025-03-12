"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dedent_js_1 = __importDefault(require("dedent-js"));
const sqlFormatter_js_1 = require("../src/sqlFormatter.js");
const behavesLikeSqlFormatter_js_1 = __importDefault(require("./behavesLikeSqlFormatter.js"));
const createTable_js_1 = __importDefault(require("./features/createTable.js"));
const dropTable_js_1 = __importDefault(require("./features/dropTable.js"));
const alterTable_js_1 = __importDefault(require("./features/alterTable.js"));
const schema_js_1 = __importDefault(require("./features/schema.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const between_js_1 = __importDefault(require("./features/between.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const constraints_js_1 = __importDefault(require("./features/constraints.js"));
const deleteFrom_js_1 = __importDefault(require("./features/deleteFrom.js"));
const comments_js_1 = __importDefault(require("./features/comments.js"));
const identifiers_js_1 = __importDefault(require("./features/identifiers.js"));
const param_js_1 = __importDefault(require("./options/param.js"));
const window_js_1 = __importDefault(require("./features/window.js"));
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const insertInto_js_1 = __importDefault(require("./features/insertInto.js"));
const update_js_1 = __importDefault(require("./features/update.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const onConflict_js_1 = __importDefault(require("./features/onConflict.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('SqliteFormatter', () => {
    const language = 'sqlite';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeSqlFormatter_js_1.default)(format);
    (0, comments_js_1.default)(format);
    (0, createView_js_1.default)(format, { ifNotExists: true });
    (0, createTable_js_1.default)(format, { ifNotExists: true });
    (0, dropTable_js_1.default)(format, { ifExists: true });
    (0, constraints_js_1.default)(format, ['SET NULL', 'SET DEFAULT', 'CASCADE', 'RESTRICT', 'NO ACTION']);
    (0, alterTable_js_1.default)(format, {
        addColumn: true,
        dropColumn: true,
        renameTo: true,
        renameColumn: true,
    });
    (0, deleteFrom_js_1.default)(format);
    (0, insertInto_js_1.default)(format);
    (0, onConflict_js_1.default)(format);
    (0, update_js_1.default)(format);
    (0, strings_js_1.default)(format, ["''-qq", "X''"]);
    (0, identifiers_js_1.default)(format, [`""-qq`, '``', '[]']);
    (0, between_js_1.default)(format);
    (0, schema_js_1.default)(format);
    (0, join_js_1.default)(format);
    (0, setOperations_js_1.default)(format, ['UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT']);
    (0, operators_js_1.default)(format, ['%', '~', '&', '|', '<<', '>>', '==', '->', '->>', '||']);
    (0, param_js_1.default)(format, { positional: true, numbered: ['?'], named: [':', '$', '@'] });
    (0, window_js_1.default)(format);
    (0, limiting_js_1.default)(format, { limit: true, offset: true });
    (0, dataTypeCase_js_1.default)(format);
    it('supports REPLACE INTO syntax', () => {
        expect(format(`REPLACE INTO tbl VALUES (1,'Leopard'),(2,'Dog');`)).toBe((0, dedent_js_1.default) `
      REPLACE INTO
        tbl
      VALUES
        (1, 'Leopard'),
        (2, 'Dog');
    `);
    });
    it('supports ON CONFLICT .. DO UPDATE syntax', () => {
        expect(format(`INSERT INTO tbl VALUES (1,'Leopard') ON CONFLICT DO UPDATE SET foo=1;`))
            .toBe((0, dedent_js_1.default) `
      INSERT INTO
        tbl
      VALUES
        (1, 'Leopard')
      ON CONFLICT DO UPDATE
      SET
        foo = 1;
    `);
    });
});
//# sourceMappingURL=sqlite.test.js.map