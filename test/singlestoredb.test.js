"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dedent_js_1 = __importDefault(require("dedent-js"));
const sqlFormatter_js_1 = require("../src/sqlFormatter.js");
const behavesLikeMariaDbFormatter_js_1 = __importDefault(require("./behavesLikeMariaDbFormatter.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const createTable_js_1 = __importDefault(require("./features/createTable.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const alterTable_js_1 = __importDefault(require("./features/alterTable.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('SingleStoreDbFormatter', () => {
    const language = 'singlestoredb';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeMariaDbFormatter_js_1.default)(format);
    // in addition to string types listed in behavesLikeMariaDbFormatter
    (0, strings_js_1.default)(format, ["B''"]);
    (0, join_js_1.default)(format, {
        without: ['NATURAL INNER JOIN', 'NATURAL FULL', 'NATURAL JOIN'],
        additionally: ['STRAIGHT_JOIN'],
    });
    (0, setOperations_js_1.default)(format, [
        'UNION',
        'UNION ALL',
        'UNION DISTINCT',
        'EXCEPT',
        'INTERSECT',
        'MINUS',
    ]);
    (0, operators_js_1.default)(format, [':=', '&', '|', '^', '~', '<<', '>>', '<=>', '&&', '||', ':>', '!:>'], { any: true });
    (0, limiting_js_1.default)(format, { limit: true, offset: true });
    (0, createTable_js_1.default)(format, { ifNotExists: true, columnComment: true, tableComment: true });
    (0, createView_js_1.default)(format);
    (0, alterTable_js_1.default)(format, {
        addColumn: true,
        dropColumn: true,
        modify: true,
        renameTo: true,
    });
    (0, dataTypeCase_js_1.default)(format);
    describe(`formats traversal of semi structured data`, () => {
        it(`formats '::' path-operator without spaces`, () => {
            expect(format(`SELECT * FROM foo WHERE json_foo::bar = 'foobar'`)).toBe((0, dedent_js_1.default) `
        SELECT
          *
        FROM
          foo
        WHERE
          json_foo::bar = 'foobar'
      `);
        });
        it(`formats '::$' conversion path-operator without spaces`, () => {
            expect(format(`SELECT * FROM foo WHERE json_foo::$bar = 'foobar'`)).toBe((0, dedent_js_1.default) `
        SELECT
          *
        FROM
          foo
        WHERE
          json_foo::$bar = 'foobar'
      `);
        });
        it(`formats '::%' conversion path-operator without spaces`, () => {
            expect(format(`SELECT * FROM foo WHERE json_foo::%bar = 'foobar'`)).toBe((0, dedent_js_1.default) `
        SELECT
          *
        FROM
          foo
        WHERE
          json_foo::%bar = 'foobar'
      `);
        });
    });
});
//# sourceMappingURL=singlestoredb.test.js.map