"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dedent_js_1 = __importDefault(require("dedent-js"));
const sqlFormatter_js_1 = require("../src/sqlFormatter.js");
const behavesLikeDb2Formatter_js_1 = __importDefault(require("./behavesLikeDb2Formatter.js"));
const createTable_js_1 = __importDefault(require("./features/createTable.js"));
const alterTable_js_1 = __importDefault(require("./features/alterTable.js"));
const dropTable_js_1 = __importDefault(require("./features/dropTable.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const comments_js_1 = __importDefault(require("./features/comments.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('Db2Formatter', () => {
    const language = 'db2';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeDb2Formatter_js_1.default)(format);
    (0, comments_js_1.default)(format);
    (0, limiting_js_1.default)(format, { limit: true, fetchNext: true, offset: true });
    (0, createTable_js_1.default)(format);
    (0, alterTable_js_1.default)(format, {
        addColumn: true,
        dropColumn: true,
        renameColumn: true,
    });
    (0, dropTable_js_1.default)(format);
    (0, join_js_1.default)(format, { without: ['NATURAL'] });
    (0, operators_js_1.default)(format, [
        '**',
        '%',
        '&',
        '|',
        '^',
        '~',
        '¬=',
        '¬>',
        '¬<',
        '!>',
        '!<',
        '^=',
        '^>',
        '^<',
        '||',
        '->',
        '=>',
    ], { any: true });
    // Additional U& string type in addition to others shared by all DB2 implementations
    (0, strings_js_1.default)(format, ["U&''"]);
    (0, dataTypeCase_js_1.default)(format);
    it('supports non-standard FOR clause', () => {
        expect(format('SELECT * FROM tbl FOR UPDATE OF other_tbl FOR RS USE AND KEEP EXCLUSIVE LOCKS'))
            .toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        tbl
      FOR UPDATE OF
        other_tbl
      FOR RS USE AND KEEP EXCLUSIVE LOCKS
    `);
    });
});
//# sourceMappingURL=db2.test.js.map