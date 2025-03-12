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
const strings_js_1 = __importDefault(require("./features/strings.js"));
const between_js_1 = __importDefault(require("./features/between.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const arrayAndMapAccessors_js_1 = __importDefault(require("./features/arrayAndMapAccessors.js"));
const comments_js_1 = __importDefault(require("./features/comments.js"));
const identifiers_js_1 = __importDefault(require("./features/identifiers.js"));
const window_js_1 = __importDefault(require("./features/window.js"));
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const update_js_1 = __importDefault(require("./features/update.js"));
const deleteFrom_js_1 = __importDefault(require("./features/deleteFrom.js"));
const truncateTable_js_1 = __importDefault(require("./features/truncateTable.js"));
const mergeInto_js_1 = __importDefault(require("./features/mergeInto.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('HiveFormatter', () => {
    const language = 'hive';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeSqlFormatter_js_1.default)(format);
    (0, comments_js_1.default)(format);
    (0, createView_js_1.default)(format, { materialized: true, ifNotExists: true });
    (0, createTable_js_1.default)(format, { ifNotExists: true });
    (0, dropTable_js_1.default)(format, { ifExists: true });
    (0, alterTable_js_1.default)(format, { renameTo: true });
    (0, update_js_1.default)(format);
    (0, deleteFrom_js_1.default)(format);
    (0, truncateTable_js_1.default)(format, { withoutTable: true });
    (0, mergeInto_js_1.default)(format);
    (0, strings_js_1.default)(format, ['""-bs', "''-bs"]);
    (0, identifiers_js_1.default)(format, ['``']);
    (0, between_js_1.default)(format);
    (0, join_js_1.default)(format, {
        without: ['NATURAL'],
        additionally: ['LEFT SEMI JOIN'],
        supportsUsing: false,
    });
    (0, setOperations_js_1.default)(format, ['UNION', 'UNION ALL', 'UNION DISTINCT']);
    (0, operators_js_1.default)(format, ['%', '~', '^', '|', '&', '<=>', '==', '!', '||'], { any: true });
    (0, arrayAndMapAccessors_js_1.default)(format);
    (0, window_js_1.default)(format);
    (0, limiting_js_1.default)(format, { limit: true });
    (0, dataTypeCase_js_1.default)(format);
    // eslint-disable-next-line no-template-curly-in-string
    it('recognizes ${hivevar:name} substitution variables', () => {
        const result = format(
        // eslint-disable-next-line no-template-curly-in-string
        "SELECT ${var1}, ${ var 2 } FROM ${hivevar:table_name} WHERE name = '${hivevar:name}';");
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        \${var1},
        \${ var 2 }
      FROM
        \${hivevar:table_name}
      WHERE
        name = '\${hivevar:name}';
    `);
    });
    it('supports SORT BY, CLUSTER BY, DISTRIBUTE BY', () => {
        const result = format('SELECT value, count DISTRIBUTE BY count CLUSTER BY value SORT BY value, count;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        value,
        count
      DISTRIBUTE BY
        count
      CLUSTER BY
        value
      SORT BY
        value,
        count;
    `);
    });
    it('formats INSERT INTO TABLE', () => {
        const result = format("INSERT INTO TABLE Customers VALUES (12,-123.4, 'Skagen 2111','Stv');");
        expect(result).toBe((0, dedent_js_1.default) `
      INSERT INTO TABLE
        Customers
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `);
    });
});
//# sourceMappingURL=hive.test.js.map