"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dedent_js_1 = __importDefault(require("dedent-js"));
const index_js_1 = require("../src/index.js");
describe('sqlFormatter', () => {
    it('throws error when unsupported language parameter specified', () => {
        expect(() => {
            (0, index_js_1.format)('SELECT *', { language: 'blah' });
        }).toThrow('Unsupported SQL dialect: blah');
    });
    describe('when encountering unsupported characters with default dialect', () => {
        it('throws error suggesting a use of a more specific dialect', () => {
            expect(() => {
                (0, index_js_1.format)('SELECT «weird-stuff»');
            }).toThrow(`Parse error: Unexpected "«weird-stu" at line 1 column 8.\n` +
                `This likely happens because you're using the default "sql" dialect.\n` +
                `If possible, please select a more specific dialect (like sqlite, postgresql, etc).`);
        });
    });
    describe('when encountering unsupported characters with sqlite dialect', () => {
        it('throws error including the name of the used dialect', () => {
            expect(() => {
                (0, index_js_1.format)('SELECT «weird-stuff»', { language: 'sqlite' });
            }).toThrow(`Parse error: Unexpected "«weird-stu" at line 1 column 8.\nSQL dialect used: "sqlite".`);
        });
    });
    it('throws error when encountering incorrect SQL grammar', () => {
        expect(() => (0, index_js_1.format)('SELECT foo.+;')).toThrow('Parse error at token: + at line 1 column 12');
    });
    it('does nothing with empty input', () => {
        const result = (0, index_js_1.format)('');
        expect(result).toBe('');
    });
    it('throws error when query argument is not string', () => {
        expect(() => (0, index_js_1.format)(undefined)).toThrow('Invalid query argument. Expected string, instead got undefined');
    });
    it('throws error when multilineLists config option used', () => {
        expect(() => {
            (0, index_js_1.format)('SELECT *', { multilineLists: 'always' });
        }).toThrow('multilineLists config is no more supported.');
    });
    it('throws error when newlineBeforeOpenParen config option used', () => {
        expect(() => {
            (0, index_js_1.format)('SELECT *', { newlineBeforeOpenParen: true });
        }).toThrow('newlineBeforeOpenParen config is no more supported.');
    });
    it('throws error when newlineBeforeCloseParen config option used', () => {
        expect(() => {
            (0, index_js_1.format)('SELECT *', { newlineBeforeCloseParen: true });
        }).toThrow('newlineBeforeCloseParen config is no more supported.');
    });
    it('throws error when aliasAs config option used', () => {
        expect(() => {
            (0, index_js_1.format)('SELECT *', { aliasAs: 'always' });
        }).toThrow('aliasAs config is no more supported.');
    });
    it('throws error when tabulateAlias config option used', () => {
        expect(() => {
            (0, index_js_1.format)('SELECT *', { tabulateAlias: false });
        }).toThrow('tabulateAlias config is no more supported.');
    });
    it('throws error when commaPosition config option used', () => {
        expect(() => {
            (0, index_js_1.format)('SELECT *', { commaPosition: 'before' });
        }).toThrow('commaPosition config is no more supported.');
    });
    describe('formatDialect()', () => {
        it('allows passing Dialect config object as a dialect parameter', () => {
            expect((0, index_js_1.formatDialect)('SELECT [foo], `bar`;', { dialect: index_js_1.sqlite })).toBe((0, dedent_js_1.default) `
        SELECT
          [foo],
          \`bar\`;
      `);
        });
        it('allows use of regex-based custom string type', () => {
            // Extend SQLite dialect with additional string type
            const sqliteWithTemplates = {
                name: 'myCustomDialect',
                tokenizerOptions: {
                    ...index_js_1.sqlite.tokenizerOptions,
                    stringTypes: [...index_js_1.sqlite.tokenizerOptions.stringTypes, { regex: String.raw `\{\{.*?\}\}` }],
                },
                formatOptions: index_js_1.sqlite.formatOptions,
            };
            expect((0, index_js_1.formatDialect)(`SELECT {{template item}}, 'normal string' FROM {{tbl}};`, {
                dialect: sqliteWithTemplates,
            })).toBe((0, dedent_js_1.default) `
        SELECT
          {{template item}},
          'normal string'
        FROM
          {{tbl}};
      `);
        });
    });
});
//# sourceMappingURL=sqlFormatter.test.js.map