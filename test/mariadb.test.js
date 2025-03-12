"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dedent_js_1 = __importDefault(require("dedent-js"));
const sqlFormatter_js_1 = require("../src/sqlFormatter.js");
const behavesLikeMariaDbFormatter_js_1 = __importDefault(require("./behavesLikeMariaDbFormatter.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const returning_js_1 = __importDefault(require("./features/returning.js"));
const setOperations_js_1 = __importStar(require("./features/setOperations.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const createTable_js_1 = __importDefault(require("./features/createTable.js"));
const param_js_1 = __importDefault(require("./options/param.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const alterTable_js_1 = __importDefault(require("./features/alterTable.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const constraints_js_1 = __importDefault(require("./features/constraints.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('MariaDbFormatter', () => {
    const language = 'mariadb';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeMariaDbFormatter_js_1.default)(format);
    // in addition to string types listed in behavesLikeMariaDbFormatter
    (0, strings_js_1.default)(format, ["B''"]);
    (0, join_js_1.default)(format, {
        without: ['FULL', 'NATURAL INNER JOIN'],
        additionally: ['STRAIGHT_JOIN'],
    });
    (0, setOperations_js_1.default)(format, [...setOperations_js_1.standardSetOperations, 'MINUS', 'MINUS ALL', 'MINUS DISTINCT']);
    (0, operators_js_1.default)(format, ['%', ':=', '&', '|', '^', '~', '<<', '>>', '<=>', '&&', '||', '!'], {
        logicalOperators: ['AND', 'OR', 'XOR'],
        any: true,
    });
    (0, returning_js_1.default)(format);
    (0, limiting_js_1.default)(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });
    (0, createTable_js_1.default)(format, {
        orReplace: true,
        ifNotExists: true,
        columnComment: true,
        tableComment: true,
    });
    (0, constraints_js_1.default)(format, ['RESTRICT', 'CASCADE', 'SET NULL', 'NO ACTION', 'SET DEFAULT']);
    (0, param_js_1.default)(format, { positional: true });
    (0, createView_js_1.default)(format, { orReplace: true, ifNotExists: true });
    (0, alterTable_js_1.default)(format, {
        addColumn: true,
        dropColumn: true,
        modify: true,
        renameTo: true,
        renameColumn: true,
    });
    (0, dataTypeCase_js_1.default)(format);
    it(`supports @"name" variables`, () => {
        expect(format(`SELECT @"foo fo", @"foo\\"x", @"foo""y" FROM tbl;`)).toBe((0, dedent_js_1.default) `
      SELECT
        @"foo fo",
        @"foo\\"x",
        @"foo""y"
      FROM
        tbl;
    `);
    });
    it(`supports @'name' variables`, () => {
        expect(format(`SELECT @'bar ar', @'bar\\'x', @'bar''y' FROM tbl;`)).toBe((0, dedent_js_1.default) `
      SELECT
        @'bar ar',
        @'bar\\'x',
        @'bar''y'
      FROM
        tbl;
    `);
    });
    it('formats ALTER TABLE ... ALTER COLUMN', () => {
        expect(format(`ALTER TABLE t ALTER COLUMN foo SET DEFAULT 10;
         ALTER TABLE t ALTER COLUMN foo DROP DEFAULT;`)).toBe((0, dedent_js_1.default) `
      ALTER TABLE t
      ALTER COLUMN foo
      SET DEFAULT 10;

      ALTER TABLE t
      ALTER COLUMN foo
      DROP DEFAULT;
    `);
    });
});
//# sourceMappingURL=mariadb.test.js.map