"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlFormatter_js_1 = require("../src/sqlFormatter.js");
const behavesLikeDb2Formatter_js_1 = __importDefault(require("./behavesLikeDb2Formatter.js"));
const comments_js_1 = __importDefault(require("./features/comments.js"));
const createTable_js_1 = __importDefault(require("./features/createTable.js"));
const alterTable_js_1 = __importDefault(require("./features/alterTable.js"));
const dropTable_js_1 = __importDefault(require("./features/dropTable.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('Db2iFormatter', () => {
    const language = 'db2i';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeDb2Formatter_js_1.default)(format);
    (0, comments_js_1.default)(format, { nestedBlockComments: true });
    (0, limiting_js_1.default)(format, { limit: true, fetchNext: true, fetchFirst: true, offset: true });
    (0, createTable_js_1.default)(format, { orReplace: true });
    (0, alterTable_js_1.default)(format, {
        addColumn: true,
        dropColumn: true,
    });
    (0, dropTable_js_1.default)(format, { ifExists: true });
    (0, join_js_1.default)(format, {
        without: ['NATURAL'],
        additionally: ['EXCEPTION JOIN', 'LEFT EXCEPTION JOIN', 'RIGHT EXCEPTION JOIN'],
    });
    (0, operators_js_1.default)(format, ['**', '¬=', '¬>', '¬<', '!>', '!<', '||', '=>'], { any: true });
    (0, dataTypeCase_js_1.default)(format);
});
//# sourceMappingURL=db2i.test.js.map