"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsStrings;
const globals_1 = require("@jest/globals");
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsStrings(format, stringTypes) {
    if (stringTypes.includes('""-qq') || stringTypes.includes('""-bs')) {
        it('supports double-quoted strings', () => {
            (0, globals_1.expect)(format('"foo JOIN bar"')).toBe('"foo JOIN bar"');
            (0, globals_1.expect)(format('SELECT "where" FROM "update"')).toBe((0, dedent_js_1.default) `
        SELECT
          "where"
        FROM
          "update"
      `);
        });
    }
    if (stringTypes.includes('""-qq')) {
        it('supports escaping double-quote by doubling it', () => {
            (0, globals_1.expect)(format('"foo""bar"')).toBe('"foo""bar"');
        });
        if (!stringTypes.includes('""-bs')) {
            it('does not support escaping double-quote with a backslash', () => {
                (0, globals_1.expect)(() => format('"foo \\" JOIN bar"')).toThrowError('Parse error: Unexpected """');
            });
        }
    }
    if (stringTypes.includes('""-bs')) {
        it('supports escaping double-quote with a backslash', () => {
            (0, globals_1.expect)(format('"foo \\" JOIN bar"')).toBe('"foo \\" JOIN bar"');
        });
        if (!stringTypes.includes('""-qq')) {
            it('does not support escaping double-quote by doubling it', () => {
                (0, globals_1.expect)(format('"foo "" JOIN bar"')).toBe('"foo " " JOIN bar"');
            });
        }
    }
    if (stringTypes.includes("''-qq") || stringTypes.includes("''-bs")) {
        it('supports single-quoted strings', () => {
            (0, globals_1.expect)(format("'foo JOIN bar'")).toBe("'foo JOIN bar'");
            (0, globals_1.expect)(format("SELECT 'where' FROM 'update'")).toBe((0, dedent_js_1.default) `
        SELECT
          'where'
        FROM
          'update'
      `);
        });
    }
    if (stringTypes.includes("''-qq")) {
        it('supports escaping single-quote by doubling it', () => {
            (0, globals_1.expect)(format("'foo''bar'")).toBe("'foo''bar'");
        });
        if (!stringTypes.includes("''-bs")) {
            it('does not support escaping single-quote with a backslash', () => {
                (0, globals_1.expect)(() => format("'foo \\' JOIN bar'")).toThrowError(`Parse error: Unexpected "'"`);
            });
        }
    }
    if (stringTypes.includes("''-bs")) {
        it('supports escaping single-quote with a backslash', () => {
            (0, globals_1.expect)(format("'foo \\' JOIN bar'")).toBe("'foo \\' JOIN bar'");
        });
        if (!stringTypes.includes("''-qq")) {
            it('does not support escaping single-quote by doubling it', () => {
                (0, globals_1.expect)(format("'foo '' JOIN bar'")).toBe("'foo ' ' JOIN bar'");
            });
        }
    }
    if (stringTypes.includes("U&''")) {
        it('supports unicode single-quoted strings', () => {
            (0, globals_1.expect)(format("U&'foo JOIN bar'")).toBe("U&'foo JOIN bar'");
            (0, globals_1.expect)(format("SELECT U&'where' FROM U&'update'")).toBe((0, dedent_js_1.default) `
        SELECT
          U&'where'
        FROM
          U&'update'
      `);
        });
        it("supports escaping in U&'' strings with repeated quote", () => {
            (0, globals_1.expect)(format("U&'foo '' JOIN bar'")).toBe("U&'foo '' JOIN bar'");
        });
        it("detects consecutive U&'' strings as separate ones", () => {
            (0, globals_1.expect)(format("U&'foo'U&'bar'")).toBe("U&'foo' U&'bar'");
        });
    }
    if (stringTypes.includes("N''")) {
        it('supports T-SQL unicode strings', () => {
            (0, globals_1.expect)(format("N'foo JOIN bar'")).toBe("N'foo JOIN bar'");
            (0, globals_1.expect)(format("SELECT N'where' FROM N'update'")).toBe((0, dedent_js_1.default) `
        SELECT
          N'where'
        FROM
          N'update'
      `);
        });
        if (stringTypes.includes("''-qq")) {
            it("supports escaping in N'' strings with repeated quote", () => {
                (0, globals_1.expect)(format("N'foo '' JOIN bar'")).toBe("N'foo '' JOIN bar'");
            });
        }
        if (stringTypes.includes("''-bs")) {
            it("supports escaping in N'' strings with a backslash", () => {
                (0, globals_1.expect)(format("N'foo \\' JOIN bar'")).toBe("N'foo \\' JOIN bar'");
            });
        }
        it("detects consecutive N'' strings as separate ones", () => {
            (0, globals_1.expect)(format("N'foo'N'bar'")).toBe("N'foo' N'bar'");
        });
    }
    if (stringTypes.includes("X''")) {
        it('supports hex byte sequences', () => {
            (0, globals_1.expect)(format("x'0E'")).toBe("x'0E'");
            (0, globals_1.expect)(format("X'1F0A89C3'")).toBe("X'1F0A89C3'");
            (0, globals_1.expect)(format("SELECT x'2B' FROM foo")).toBe((0, dedent_js_1.default) `
        SELECT
          x'2B'
        FROM
          foo
      `);
        });
        it("detects consecutive X'' strings as separate ones", () => {
            (0, globals_1.expect)(format("X'AE01'X'01F6'")).toBe("X'AE01' X'01F6'");
        });
    }
    if (stringTypes.includes('X""')) {
        it('supports hex byte sequences', () => {
            (0, globals_1.expect)(format(`x"0E"`)).toBe(`x"0E"`);
            (0, globals_1.expect)(format(`X"1F0A89C3"`)).toBe(`X"1F0A89C3"`);
            (0, globals_1.expect)(format(`SELECT x"2B" FROM foo`)).toBe((0, dedent_js_1.default) `
        SELECT
          x"2B"
        FROM
          foo
      `);
        });
        it(`detects consecutive X" strings as separate ones`, () => {
            (0, globals_1.expect)(format(`X"AE01"X"01F6"`)).toBe(`X"AE01" X"01F6"`);
        });
    }
    if (stringTypes.includes("B''")) {
        it('supports bit sequences', () => {
            (0, globals_1.expect)(format("b'01'")).toBe("b'01'");
            (0, globals_1.expect)(format("B'10110'")).toBe("B'10110'");
            (0, globals_1.expect)(format("SELECT b'0101' FROM foo")).toBe((0, dedent_js_1.default) `
        SELECT
          b'0101'
        FROM
          foo
      `);
        });
        it("detects consecutive B'' strings as separate ones", () => {
            (0, globals_1.expect)(format("B'1001'B'0110'")).toBe("B'1001' B'0110'");
        });
    }
    if (stringTypes.includes('B""')) {
        it('supports bit sequences (with double-qoutes)', () => {
            (0, globals_1.expect)(format(`b"01"`)).toBe(`b"01"`);
            (0, globals_1.expect)(format(`B"10110"`)).toBe(`B"10110"`);
            (0, globals_1.expect)(format(`SELECT b"0101" FROM foo`)).toBe((0, dedent_js_1.default) `
        SELECT
          b"0101"
        FROM
          foo
      `);
        });
        it(`detects consecutive B"" strings as separate ones`, () => {
            (0, globals_1.expect)(format(`B"1001"B"0110"`)).toBe(`B"1001" B"0110"`);
        });
    }
    if (stringTypes.includes("R''")) {
        it('supports no escaping in raw strings', () => {
            (0, globals_1.expect)(format("SELECT r'some \\',R'text' FROM foo")).toBe((0, dedent_js_1.default) `
        SELECT
          r'some \\',
          R'text'
        FROM
          foo
      `);
        });
        it("detects consecutive r'' strings as separate ones", () => {
            (0, globals_1.expect)(format("r'a ha'r'hm mm'")).toBe("r'a ha' r'hm mm'");
        });
    }
    if (stringTypes.includes('R""')) {
        it('supports no escaping in raw strings (with double-quotes)', () => {
            (0, globals_1.expect)(format(`SELECT r"some \\", R"text" FROM foo`)).toBe((0, dedent_js_1.default) `
        SELECT
          r"some \\",
          R"text"
        FROM
          foo
      `);
        });
        it(`detects consecutive r"" strings as separate ones`, () => {
            (0, globals_1.expect)(format(`r"a ha"r"hm mm"`)).toBe(`r"a ha" r"hm mm"`);
        });
    }
}
//# sourceMappingURL=strings.js.map