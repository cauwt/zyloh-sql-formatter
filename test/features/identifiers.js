"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsIdentifiers;
const globals_1 = require("@jest/globals");
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsIdentifiers(format, identifierTypes) {
    if (identifierTypes.includes('""-qq')) {
        it('supports double-quoted identifiers', () => {
            (0, globals_1.expect)(format('"foo JOIN bar"')).toBe('"foo JOIN bar"');
            (0, globals_1.expect)(format('SELECT "where" FROM "update"')).toBe((0, dedent_js_1.default) `
        SELECT
          "where"
        FROM
          "update"
      `);
        });
        it('no space around dot between two double-quoted identifiers', () => {
            const result = format(`SELECT "my table"."col name";`);
            (0, globals_1.expect)(result).toBe((0, dedent_js_1.default) `
        SELECT
          "my table"."col name";
      `);
        });
        it('supports escaping double-quote by doubling it', () => {
            (0, globals_1.expect)(format('"foo""bar"')).toBe('"foo""bar"');
        });
        it('does not support escaping double-quote with a backslash', () => {
            (0, globals_1.expect)(() => format('"foo \\" JOIN bar"')).toThrowError('Parse error: Unexpected "');
        });
    }
    if (identifierTypes.includes('``')) {
        it('supports backtick-quoted identifiers', () => {
            (0, globals_1.expect)(format('`foo JOIN bar`')).toBe('`foo JOIN bar`');
            (0, globals_1.expect)(format('SELECT `where` FROM `update`')).toBe((0, dedent_js_1.default) `
        SELECT
          \`where\`
        FROM
          \`update\`
      `);
        });
        it('supports escaping backtick by doubling it', () => {
            (0, globals_1.expect)(format('`foo `` JOIN bar`')).toBe('`foo `` JOIN bar`');
        });
        it('no space around dot between two backtick-quoted identifiers', () => {
            const result = format(`SELECT \`my table\`.\`col name\`;`);
            (0, globals_1.expect)(result).toBe((0, dedent_js_1.default) `
        SELECT
          \`my table\`.\`col name\`;
      `);
        });
    }
    if (identifierTypes.includes('U&""')) {
        it('supports unicode double-quoted identifiers', () => {
            (0, globals_1.expect)(format('U&"foo JOIN bar"')).toBe('U&"foo JOIN bar"');
            (0, globals_1.expect)(format('SELECT U&"where" FROM U&"update"')).toBe((0, dedent_js_1.default) `
        SELECT
          U&"where"
        FROM
          U&"update"
      `);
        });
        it('no space around dot between unicode double-quoted identifiers', () => {
            const result = format(`SELECT U&"my table".U&"col name";`);
            (0, globals_1.expect)(result).toBe((0, dedent_js_1.default) `
        SELECT
          U&"my table".U&"col name";
      `);
        });
        it('supports escaping in U&"" strings by repeated quote', () => {
            (0, globals_1.expect)(format('U&"foo "" JOIN bar"')).toBe('U&"foo "" JOIN bar"');
        });
        it('detects consecutive U&"" identifiers as separate ones', () => {
            (0, globals_1.expect)(format('U&"foo"U&"bar"')).toBe('U&"foo" U&"bar"');
        });
        it('does not supports escaping in U&"" strings with a backslash', () => {
            (0, globals_1.expect)(() => format('U&"foo \\" JOIN bar"')).toThrowError('Parse error: Unexpected "');
        });
    }
    if (identifierTypes.includes('[]')) {
        it('supports [bracket-quoted identifiers]', () => {
            (0, globals_1.expect)(format('[foo JOIN bar]')).toBe('[foo JOIN bar]');
            (0, globals_1.expect)(format('SELECT [where] FROM [update]')).toBe((0, dedent_js_1.default) `
        SELECT
          [where]
        FROM
          [update]
      `);
        });
        it('supports escaping close-bracket by doubling it', () => {
            (0, globals_1.expect)(format('[foo ]] JOIN bar]')).toBe('[foo ]] JOIN bar]');
        });
        it('no space around dot between two [bracket-quoted identifiers]', () => {
            const result = format(`SELECT [my table].[col name];`);
            (0, globals_1.expect)(result).toBe((0, dedent_js_1.default) `
        SELECT
          [my table].[col name];
      `);
        });
    }
}
//# sourceMappingURL=identifiers.js.map