"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = behavesLikeSqlFormatter;
const dedent_js_1 = __importDefault(require("dedent-js"));
const case_js_1 = __importDefault(require("./features/case.js"));
const numbers_js_1 = __importDefault(require("./features/numbers.js"));
const with_js_1 = __importDefault(require("./features/with.js"));
const tabWidth_js_1 = __importDefault(require("./options/tabWidth.js"));
const useTabs_js_1 = __importDefault(require("./options/useTabs.js"));
const expressionWidth_js_1 = __importDefault(require("./options/expressionWidth.js"));
const keywordCase_js_1 = __importDefault(require("./options/keywordCase.js"));
const identifierCase_js_1 = __importDefault(require("./options/identifierCase.js"));
const indentStyle_js_1 = __importDefault(require("./options/indentStyle.js"));
const linesBetweenQueries_js_1 = __importDefault(require("./options/linesBetweenQueries.js"));
const newlineBeforeSemicolon_js_1 = __importDefault(require("./options/newlineBeforeSemicolon.js"));
const logicalOperatorNewline_js_1 = __importDefault(require("./options/logicalOperatorNewline.js"));
const paramTypes_js_1 = __importDefault(require("./options/paramTypes.js"));
const windowFunctions_js_1 = __importDefault(require("./features/windowFunctions.js"));
const functionCase_js_1 = __importDefault(require("./options/functionCase.js"));
const disableComment_js_1 = __importDefault(require("./features/disableComment.js"));
/**
 * Core tests for all SQL formatters
 */
function behavesLikeSqlFormatter(format) {
    (0, disableComment_js_1.default)(format);
    (0, case_js_1.default)(format);
    (0, numbers_js_1.default)(format);
    (0, with_js_1.default)(format);
    (0, tabWidth_js_1.default)(format);
    (0, useTabs_js_1.default)(format);
    (0, keywordCase_js_1.default)(format);
    (0, identifierCase_js_1.default)(format);
    (0, functionCase_js_1.default)(format);
    (0, indentStyle_js_1.default)(format);
    (0, linesBetweenQueries_js_1.default)(format);
    (0, expressionWidth_js_1.default)(format);
    (0, newlineBeforeSemicolon_js_1.default)(format);
    (0, logicalOperatorNewline_js_1.default)(format);
    (0, paramTypes_js_1.default)(format);
    (0, windowFunctions_js_1.default)(format);
    it('formats SELECT with asterisks', () => {
        const result = format('SELECT tbl.*, count(*), col1 * col2 FROM tbl;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        tbl.*,
        count(*),
        col1 * col2
      FROM
        tbl;
    `);
    });
    it('formats complex SELECT', () => {
        const result = format("SELECT DISTINCT name, ROUND(age/7) field1, 18 + 20 AS field2, 'some string' FROM foo;");
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT DISTINCT
        name,
        ROUND(age / 7) field1,
        18 + 20 AS field2,
        'some string'
      FROM
        foo;
    `);
    });
    it('formats SELECT with complex WHERE', () => {
        const result = format(`
      SELECT * FROM foo WHERE Column1 = 'testing'
      AND ( (Column2 = Column3 OR Column4 >= ABS(5)) );
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        foo
      WHERE
        Column1 = 'testing'
        AND (
          (
            Column2 = Column3
            OR Column4 >= ABS(5)
          )
        );
    `);
    });
    it('formats SELECT with top level reserved words', () => {
        const result = format(`
      SELECT * FROM foo WHERE name = 'John' GROUP BY some_column
      HAVING column > 10 ORDER BY other_column;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        foo
      WHERE
        name = 'John'
      GROUP BY
        some_column
      HAVING
        column > 10
      ORDER BY
        other_column;
    `);
    });
    it('allows keywords as column names in tbl.col syntax', () => {
        const result = format('SELECT mytable.update, mytable.select FROM mytable WHERE mytable.from > 10;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        mytable.update,
        mytable.select
      FROM
        mytable
      WHERE
        mytable.from > 10;
    `);
    });
    it('formats ORDER BY', () => {
        const result = format(`
      SELECT * FROM foo ORDER BY col1 ASC, col2 DESC;
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        foo
      ORDER BY
        col1 ASC,
        col2 DESC;
    `);
    });
    it('formats SELECT query with SELECT query inside it', () => {
        const result = format('SELECT *, SUM(*) AS total FROM (SELECT * FROM Posts WHERE age > 10) WHERE a > b');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *,
        SUM(*) AS total
      FROM
        (
          SELECT
            *
          FROM
            Posts
          WHERE
            age > 10
        )
      WHERE
        a > b
    `);
    });
    it('formats open paren after comma', () => {
        const result = format('INSERT INTO TestIds (id) VALUES (4),(5), (6),(7),(9),(10),(11);');
        expect(result).toBe((0, dedent_js_1.default) `
      INSERT INTO
        TestIds (id)
      VALUES
        (4),
        (5),
        (6),
        (7),
        (9),
        (10),
        (11);
    `);
    });
    it('keeps short parenthesized list with nested parenthesis on single line', () => {
        const result = format('SELECT (a + b * (c - SIN(1)));');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        (a + b * (c - SIN(1)));
    `);
    });
    it('breaks long parenthesized lists to multiple lines', () => {
        const result = format(`
      INSERT INTO some_table (id_product, id_shop, id_currency, id_country, id_registration) (
      SELECT COALESCE(dq.id_discounter_shopping = 2, dq.value, dq.value / 100),
      COALESCE (dq.id_discounter_shopping = 2, 'amount', 'percentage') FROM foo);
    `);
        expect(result).toBe((0, dedent_js_1.default) `
      INSERT INTO
        some_table (
          id_product,
          id_shop,
          id_currency,
          id_country,
          id_registration
        ) (
          SELECT
            COALESCE(
              dq.id_discounter_shopping = 2,
              dq.value,
              dq.value / 100
            ),
            COALESCE(
              dq.id_discounter_shopping = 2,
              'amount',
              'percentage'
            )
          FROM
            foo
        );
    `);
    });
    it('formats top-level and newline multi-word reserved words with inconsistent spacing', () => {
        const result = format('SELECT * FROM foo LEFT \t   \n JOIN mycol ORDER \n BY blah');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        *
      FROM
        foo
        LEFT JOIN mycol
      ORDER BY
        blah
    `);
    });
    it('formats long double parenthized queries to multiple lines', () => {
        const result = format("((foo = '0123456789-0123456789-0123456789-0123456789'))");
        expect(result).toBe((0, dedent_js_1.default) `
      (
        (
          foo = '0123456789-0123456789-0123456789-0123456789'
        )
      )
    `);
    });
    it('formats short double parenthized queries to one line', () => {
        const result = format("((foo = 'bar'))");
        expect(result).toBe("((foo = 'bar'))");
    });
    it('supports unicode letters in identifiers', () => {
        const result = format('SELECT 结合使用, тест FROM töörõõm;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        结合使用,
        тест
      FROM
        töörõõm;
    `);
    });
    // Using Myanmar and Tibetan digits 1, 2, 3
    it('supports unicode numbers in identifiers', () => {
        const result = format('SELECT my၁၂၃ FROM tbl༡༢༣;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        my၁၂၃
      FROM
        tbl༡༢༣;
    `);
    });
    it('supports unicode diacritical marks in identifiers', () => {
        const COMBINING_TILDE = String.fromCodePoint(0x0303);
        const result = format('SELECT o' + COMBINING_TILDE + ' FROM tbl;');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        õ
      FROM
        tbl;
    `);
    });
}
//# sourceMappingURL=behavesLikeSqlFormatter.js.map