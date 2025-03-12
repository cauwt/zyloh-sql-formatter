"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dedent_js_1 = __importDefault(require("dedent-js"));
const sqlFormatter_js_1 = require("../src/sqlFormatter.js");
const behavesLikeSqlFormatter_js_1 = __importDefault(require("./behavesLikeSqlFormatter.js"));
const between_js_1 = __importDefault(require("./features/between.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const schema_js_1 = __importDefault(require("./features/schema.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const returning_js_1 = __importDefault(require("./features/returning.js"));
const deleteFrom_js_1 = __importDefault(require("./features/deleteFrom.js"));
const arrayAndMapAccessors_js_1 = __importDefault(require("./features/arrayAndMapAccessors.js"));
const arrayLiterals_js_1 = __importDefault(require("./features/arrayLiterals.js"));
const comments_js_1 = __importDefault(require("./features/comments.js"));
const identifiers_js_1 = __importDefault(require("./features/identifiers.js"));
const param_js_1 = __importDefault(require("./options/param.js"));
const window_js_1 = __importDefault(require("./features/window.js"));
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const insertInto_js_1 = __importDefault(require("./features/insertInto.js"));
const update_js_1 = __importDefault(require("./features/update.js"));
const mergeInto_js_1 = __importDefault(require("./features/mergeInto.js"));
describe('N1qlFormatter', () => {
    const language = 'n1ql';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeSqlFormatter_js_1.default)(format);
    (0, comments_js_1.default)(format, { hashComments: true });
    (0, deleteFrom_js_1.default)(format);
    (0, strings_js_1.default)(format, [`""-bs`]);
    (0, identifiers_js_1.default)(format, ['``']);
    (0, between_js_1.default)(format);
    (0, schema_js_1.default)(format);
    (0, operators_js_1.default)(format, ['%', '==', '||'], {
        logicalOperators: ['AND', 'OR', 'XOR'],
        any: true,
    });
    (0, arrayAndMapAccessors_js_1.default)(format);
    (0, arrayLiterals_js_1.default)(format, { withoutArrayPrefix: true });
    (0, join_js_1.default)(format, { without: ['FULL', 'CROSS', 'NATURAL'], supportsUsing: false });
    (0, setOperations_js_1.default)(format, [
        'UNION',
        'UNION ALL',
        'EXCEPT',
        'EXCEPT ALL',
        'INTERSECT',
        'INTERSECT ALL',
    ]);
    (0, returning_js_1.default)(format);
    (0, param_js_1.default)(format, { positional: true, numbered: ['$'], named: ['$'] });
    (0, window_js_1.default)(format);
    (0, limiting_js_1.default)(format, { limit: true, offset: true });
    (0, insertInto_js_1.default)(format);
    (0, update_js_1.default)(format);
    (0, mergeInto_js_1.default)(format);
    it('formats INSERT with {} object literal', () => {
        const result = format("INSERT INTO heroes (KEY, VALUE) VALUES ('123', {'id':1,'type':'Tarzan'});");
        expect(result).toBe((0, dedent_js_1.default) `
      INSERT INTO
        heroes (KEY, VALUE)
      VALUES
        ('123', {'id': 1, 'type': 'Tarzan'});
    `);
    });
    it('formats INSERT with large object and array literals', () => {
        const result = format(`
      INSERT INTO heroes (KEY, VALUE) VALUES ('123', {'id': 1, 'type': 'Tarzan',
      'array': [123456789, 123456789, 123456789, 123456789, 123456789], 'hello': 'world'});
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      INSERT INTO
        heroes (KEY, VALUE)
      VALUES
        (
          '123',
          {
            'id': 1,
            'type': 'Tarzan',
            'array': [
              123456789,
              123456789,
              123456789,
              123456789,
              123456789
            ],
            'hello': 'world'
          }
        );
    `);
    });
    it('formats SELECT query with UNNEST top level reserver word', () => {
        const result = format('SELECT * FROM tutorial UNNEST tutorial.children c;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        tutorial
      UNNEST
        tutorial.children c;
    `);
    });
    it('formats SELECT query with NEST and USE KEYS', () => {
        const result = format(`
      SELECT * FROM usr
      USE KEYS 'Elinor_33313792' NEST orders_with_users orders
      ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history END;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        usr
      USE KEYS 'Elinor_33313792'
      NEST
        orders_with_users orders ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history END;
    `);
    });
    it('formats explained DELETE query with USE KEYS', () => {
        const result = format("EXPLAIN DELETE FROM tutorial t USE KEYS 'baldwin'");
        expect(result).toBe((0, dedent_js_1.default) `
      EXPLAIN
      DELETE FROM tutorial t
      USE KEYS 'baldwin'
    `);
    });
    it('formats UPDATE query with USE KEYS', () => {
        const result = format("UPDATE tutorial USE KEYS 'baldwin' SET type = 'actor'");
        expect(result).toBe((0, dedent_js_1.default) `
      UPDATE tutorial
      USE KEYS 'baldwin'
      SET
        type = 'actor'
    `);
    });
});
//# sourceMappingURL=n1ql.test.js.map