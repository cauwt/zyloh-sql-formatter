"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsParams;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsParams(format, params) {
    describe('supports params', () => {
        if (params.positional) {
            it('leaves ? positional placeholders as is when no params config provided', () => {
                const result = format('SELECT ?, ?, ?;');
                expect(result).toBe((0, dedent_js_1.default) `
          SELECT
            ?,
            ?,
            ?;
        `);
            });
            it('replaces ? positional placeholders with param values', () => {
                const result = format('SELECT ?, ?, ?;', {
                    params: ['first', 'second', 'third'],
                });
                expect(result).toBe((0, dedent_js_1.default) `
          SELECT
            first,
            second,
            third;
        `);
            });
            // Regression test for issue #316
            it('replaces ? positional placeholders inside BETWEEN expression', () => {
                const result = format('SELECT name WHERE age BETWEEN ? AND ?;', {
                    params: ['5', '10'],
                });
                expect(result).toBe((0, dedent_js_1.default) `
          SELECT
            name
          WHERE
            age BETWEEN 5 AND 10;
        `);
            });
        }
        if (params.numbered?.includes('?')) {
            it('recognizes ? numbered placeholders', () => {
                const result = format('SELECT ?1, ?25, ?2;');
                expect(result).toBe((0, dedent_js_1.default) `
          SELECT
            ?1,
            ?25,
            ?2;
        `);
            });
            it('replaces ? numbered placeholders with param values', () => {
                const result = format('SELECT ?1, ?2, ?0;', {
                    params: {
                        0: 'first',
                        1: 'second',
                        2: 'third',
                    },
                });
                expect(result).toBe((0, dedent_js_1.default) `
          SELECT
            second,
            third,
            first;
        `);
            });
        }
        if (params.numbered?.includes('$')) {
            it('recognizes $n placeholders', () => {
                const result = format('SELECT $1, $2 FROM tbl');
                expect(result).toBe((0, dedent_js_1.default) `
          SELECT
            $1,
            $2
          FROM
            tbl
        `);
            });
            it('replaces $n placeholders with param values', () => {
                const result = format('SELECT $1, $2 FROM tbl', {
                    params: { 1: '"variable value"', 2: '"blah"' },
                });
                expect(result).toBe((0, dedent_js_1.default) `
          SELECT
            "variable value",
            "blah"
          FROM
            tbl
        `);
            });
        }
        if (params.numbered?.includes(':')) {
            it('recognizes :n placeholders', () => {
                const result = format('SELECT :1, :2 FROM tbl');
                expect(result).toBe((0, dedent_js_1.default) `
          SELECT
            :1,
            :2
          FROM
            tbl
        `);
            });
            it('replaces :n placeholders with param values', () => {
                const result = format('SELECT :1, :2 FROM tbl', {
                    params: { 1: '"variable value"', 2: '"blah"' },
                });
                expect(result).toBe((0, dedent_js_1.default) `
          SELECT
            "variable value",
            "blah"
          FROM
            tbl
        `);
            });
        }
        if (params.named?.includes(':')) {
            it('recognizes :name placeholders', () => {
                expect(format('SELECT :foo, :bar, :baz;')).toBe((0, dedent_js_1.default) `
          SELECT
            :foo,
            :bar,
            :baz;
        `);
            });
            it('replaces :name placeholders with param values', () => {
                expect(format(`WHERE name = :name AND age > :current_age;`, {
                    params: { name: "'John'", current_age: '10' },
                })).toBe((0, dedent_js_1.default) `
          WHERE
            name = 'John'
            AND age > 10;
        `);
            });
        }
        if (params.named?.includes('$')) {
            it('recognizes $name placeholders', () => {
                expect(format('SELECT $foo, $bar, $baz;')).toBe((0, dedent_js_1.default) `
          SELECT
            $foo,
            $bar,
            $baz;
        `);
            });
            it('replaces $name placeholders with param values', () => {
                expect(format(`WHERE name = $name AND age > $current_age;`, {
                    params: { name: "'John'", current_age: '10' },
                })).toBe((0, dedent_js_1.default) `
          WHERE
            name = 'John'
            AND age > 10;
        `);
            });
        }
    });
    if (params.named?.includes('@')) {
        it('recognizes @name placeholders', () => {
            expect(format('SELECT @foo, @bar, @baz;')).toBe((0, dedent_js_1.default) `
        SELECT
          @foo,
          @bar,
          @baz;
      `);
        });
        it('replaces @name placeholders with param values', () => {
            expect(format(`WHERE name = @name AND age > @current_age;`, {
                params: { name: "'John'", current_age: '10' },
            })).toBe((0, dedent_js_1.default) `
        WHERE
          name = 'John'
          AND age > 10;
      `);
        });
    }
    if (params.quoted?.includes('@""')) {
        it(`recognizes @"name" placeholders`, () => {
            expect(format(`SELECT @"foo", @"foo bar";`)).toBe((0, dedent_js_1.default) `
        SELECT
          @"foo",
          @"foo bar";
      `);
        });
        it(`replaces @"name" placeholders with param values`, () => {
            expect(format(`WHERE name = @"name" AND age > @"current age";`, {
                params: { 'name': "'John'", 'current age': '10' },
            })).toBe((0, dedent_js_1.default) `
        WHERE
          name = 'John'
          AND age > 10;
      `);
        });
    }
    if (params.quoted?.includes('@[]')) {
        it(`recognizes @[name] placeholders`, () => {
            expect(format(`SELECT @[foo], @[foo bar];`)).toBe((0, dedent_js_1.default) `
        SELECT
          @[foo],
          @[foo bar];
      `);
        });
        it(`replaces @[name] placeholders with param values`, () => {
            expect(format(`WHERE name = @[name] AND age > @[current age];`, {
                params: { 'name': "'John'", 'current age': '10' },
            })).toBe((0, dedent_js_1.default) `
        WHERE
          name = 'John'
          AND age > 10;
      `);
        });
    }
    if (params.quoted?.includes('@``')) {
        it('recognizes @`name` placeholders', () => {
            expect(format('SELECT @`foo`, @`foo bar`;')).toBe((0, dedent_js_1.default) `
        SELECT
          @\`foo\`,
          @\`foo bar\`;
      `);
        });
        it('replaces @`name` placeholders with param values', () => {
            expect(format('WHERE name = @`name` AND age > @`current age`;', {
                params: { 'name': "'John'", 'current age': '10' },
            })).toBe((0, dedent_js_1.default) `
        WHERE
          name = 'John'
          AND age > 10;
      `);
        });
    }
}
//# sourceMappingURL=param.js.map