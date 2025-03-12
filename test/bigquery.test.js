"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dedent_js_1 = __importDefault(require("dedent-js"));
const sqlFormatter_js_1 = require("../src/sqlFormatter.js");
const behavesLikeSqlFormatter_js_1 = __importDefault(require("./behavesLikeSqlFormatter.js"));
const createTable_js_1 = __importDefault(require("./features/createTable.js"));
const dropTable_js_1 = __importDefault(require("./features/dropTable.js"));
const strings_js_1 = __importDefault(require("./features/strings.js"));
const arrayLiterals_js_1 = __importDefault(require("./features/arrayLiterals.js"));
const between_js_1 = __importDefault(require("./features/between.js"));
const join_js_1 = __importDefault(require("./features/join.js"));
const operators_js_1 = __importDefault(require("./features/operators.js"));
const deleteFrom_js_1 = __importDefault(require("./features/deleteFrom.js"));
const comments_js_1 = __importDefault(require("./features/comments.js"));
const identifiers_js_1 = __importDefault(require("./features/identifiers.js"));
const param_js_1 = __importDefault(require("./options/param.js"));
const window_js_1 = __importDefault(require("./features/window.js"));
const setOperations_js_1 = __importDefault(require("./features/setOperations.js"));
const limiting_js_1 = __importDefault(require("./features/limiting.js"));
const insertInto_js_1 = __importDefault(require("./features/insertInto.js"));
const update_js_1 = __importDefault(require("./features/update.js"));
const truncateTable_js_1 = __importDefault(require("./features/truncateTable.js"));
const mergeInto_js_1 = __importDefault(require("./features/mergeInto.js"));
const createView_js_1 = __importDefault(require("./features/createView.js"));
const alterTable_js_1 = __importDefault(require("./features/alterTable.js"));
const isDistinctFrom_js_1 = __importDefault(require("./features/isDistinctFrom.js"));
const dataTypeCase_js_1 = __importDefault(require("./options/dataTypeCase.js"));
describe('BigQueryFormatter', () => {
    const language = 'bigquery';
    const format = (query, cfg = {}) => (0, sqlFormatter_js_1.format)(query, { ...cfg, language });
    (0, behavesLikeSqlFormatter_js_1.default)(format);
    (0, comments_js_1.default)(format, { hashComments: true });
    (0, createView_js_1.default)(format, { orReplace: true, materialized: true, ifNotExists: true });
    (0, createTable_js_1.default)(format, { orReplace: true, ifNotExists: true });
    (0, dropTable_js_1.default)(format, { ifExists: true });
    (0, alterTable_js_1.default)(format, {
        addColumn: true,
        dropColumn: true,
        renameTo: true,
    });
    (0, deleteFrom_js_1.default)(format, { withoutFrom: true });
    (0, insertInto_js_1.default)(format, { withoutInto: true });
    (0, update_js_1.default)(format);
    (0, truncateTable_js_1.default)(format);
    (0, mergeInto_js_1.default)(format);
    (0, strings_js_1.default)(format, ['""-bs', "''-bs", "R''", 'R""', "B''", 'B""']);
    (0, identifiers_js_1.default)(format, ['``']);
    (0, arrayLiterals_js_1.default)(format, { withArrayPrefix: true, withoutArrayPrefix: true });
    (0, between_js_1.default)(format);
    (0, join_js_1.default)(format, { without: ['NATURAL'] });
    (0, setOperations_js_1.default)(format, [
        'UNION ALL',
        'UNION DISTINCT',
        'EXCEPT DISTINCT',
        'INTERSECT DISTINCT',
    ]);
    (0, operators_js_1.default)(format, ['&', '|', '^', '~', '>>', '<<', '||', '=>'], { any: true });
    (0, isDistinctFrom_js_1.default)(format);
    (0, param_js_1.default)(format, { positional: true, named: ['@'], quoted: ['@``'] });
    (0, window_js_1.default)(format);
    (0, limiting_js_1.default)(format, { limit: true, offset: true });
    (0, dataTypeCase_js_1.default)(format);
    // Note: BigQuery supports single dashes inside identifiers, so my-ident would be
    // detected as identifier, while other SQL dialects would detect it as
    // "my" <minus> "ident"
    // https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical
    it('supports dashes inside identifiers', () => {
        const result = format('SELECT alpha-foo, where-long-identifier\nFROM beta');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        alpha-foo,
        where-long-identifier
      FROM
        beta
    `);
    });
    it('supports @@variables', () => {
        expect(format('SELECT @@error.message, @@time_zone')).toBe((0, dedent_js_1.default) `
      SELECT
        @@error.message,
        @@time_zone
    `);
    });
    // BigQuery-specific string types
    it('supports strings with rb prefixes', () => {
        expect(format(`SELECT rb"huh", br'bulu bulu', BR'la la' FROM foo`)).toBe((0, dedent_js_1.default) `
      SELECT
        rb"huh",
        br'bulu bulu',
        BR'la la'
      FROM
        foo
    `);
    });
    it('supports triple-quoted strings', () => {
        expect(format(`SELECT '''hello 'my' world''', """hello "my" world""", """\\"quoted\\"""" FROM foo`)).toBe((0, dedent_js_1.default) `
      SELECT
        '''hello 'my' world''',
        """hello "my" world""",
        """\\"quoted\\""""
      FROM
        foo
    `);
    });
    it('supports strings with r, b and rb prefixes with triple-quoted strings', () => {
        expect(format(`SELECT R'''blah''', B'''sah''', rb"""hu"h""", br'''bulu bulu''', r"""haha""", BR'''la' la''' FROM foo`)).toBe((0, dedent_js_1.default) `
      SELECT
        R'''blah''',
        B'''sah''',
        rb"""hu"h""",
        br'''bulu bulu''',
        r"""haha""",
        BR'''la' la'''
      FROM
        foo
    `);
    });
    it('supports STRUCT types', () => {
        const result = format('SELECT STRUCT("Alpha" as name, [23.4, 26.3, 26.4] as splits) FROM beta');
        expect(result).toBe((0, dedent_js_1.default) `
      SELECT
        STRUCT("Alpha" as name, [23.4, 26.3, 26.4] as splits)
      FROM
        beta
    `);
    });
    it('supports parametric ARRAY', () => {
        expect(format('SELECT ARRAY<FLOAT>[1]')).toBe((0, dedent_js_1.default) `
      SELECT
        ARRAY<FLOAT>[1]
    `);
    });
    it('STRUCT and ARRAY type case is affected by dataTypeCase option', () => {
        expect(format('SELECT array<struct<y int64, z string>>[(1, "foo")]', { dataTypeCase: 'upper' }))
            .toBe((0, dedent_js_1.default) `
      SELECT
        ARRAY<STRUCT<y INT64, z STRING>>[(1, "foo")]
    `);
    });
    // TODO: Possibly incorrect formatting of STRUCT<>() and ARRAY<>()
    it('supports parametric STRUCT', () => {
        expect(format('SELECT STRUCT<ARRAY<INT64>>([])')).toBe((0, dedent_js_1.default) `
      SELECT
        STRUCT<ARRAY<INT64>> ([])
    `);
    });
    // Issue #279
    it('supports parametric STRUCT with named fields', () => {
        expect(format('SELECT STRUCT<y INT64, z STRING>(1,"foo"), STRUCT<arr ARRAY<INT64>>([1,2,3]);'))
            .toBe((0, dedent_js_1.default) `
      SELECT
        STRUCT<y INT64, z STRING> (1, "foo"),
        STRUCT<arr ARRAY<INT64>> ([1, 2, 3]);
    `);
    });
    it('supports uppercasing of STRUCT', () => {
        expect(format('select struct<Nr int64, myName string>(1,"foo");', { keywordCase: 'upper' }))
            .toBe((0, dedent_js_1.default) `
      SELECT
        STRUCT<Nr INT64, myName STRING> (1, "foo");
    `);
    });
    // XXX: This is hard to achieve with our current type-parameter processing hack.
    // At least we're preserving the case of identifier names here,
    // and lowercasing is luckily less used than uppercasing.
    it('does not support lowercasing of STRUCT', () => {
        expect(format('SELECT STRUCT<Nr INT64, myName STRING>(1,"foo");', { keywordCase: 'lower' }))
            .toBe((0, dedent_js_1.default) `
      select
        STRUCT<Nr INT64, myName STRING> (1, "foo");
    `);
    });
    it('supports QUALIFY clause', () => {
        expect(format(`
        SELECT
          item,
          RANK() OVER (PARTITION BY category ORDER BY purchases DESC) AS rank
        FROM Produce
        WHERE Produce.category = 'vegetable'
        QUALIFY rank <= 3
      `)).toBe((0, dedent_js_1.default) `
      SELECT
        item,
        RANK() OVER (
          PARTITION BY
            category
          ORDER BY
            purchases DESC
        ) AS rank
      FROM
        Produce
      WHERE
        Produce.category = 'vegetable'
      QUALIFY
        rank <= 3
    `);
    });
    it('supports parameterised types', () => {
        const sql = (0, dedent_js_1.default) `
      DECLARE varString STRING(11) '11charswide';
      DECLARE varBytes BYTES(8);
      DECLARE varNumeric NUMERIC(1, 1);
      DECLARE varDecimal DECIMAL(1, 1);
      DECLARE varBignumeric BIGNUMERIC(1, 1);
      DECLARE varBigdecimal BIGDECIMAL(1, 1);
    `;
        expect(format(sql, { linesBetweenQueries: 0 })).toBe(sql);
    });
    // Regression test for issue #243
    it('supports array subscript operator', () => {
        expect(format(`
      SELECT item_array[OFFSET(1)] AS item_offset,
      item_array[ORDINAL(1)] AS item_ordinal,
      item_array[SAFE_OFFSET(6)] AS item_safe_offset,
      item_array[SAFE_ORDINAL(6)] AS item_safe_ordinal
      FROM Items;
    `)).toBe((0, dedent_js_1.default) `
      SELECT
        item_array[OFFSET(1)] AS item_offset,
        item_array[ORDINAL(1)] AS item_ordinal,
        item_array[SAFE_OFFSET(6)] AS item_safe_offset,
        item_array[SAFE_ORDINAL(6)] AS item_safe_ordinal
      FROM
        Items;
    `);
    });
    it('supports named arguments', () => {
        expect(format(`
      SELECT MAKE_INTERVAL(1, day=>2, minute => 3)
      `)).toBe((0, dedent_js_1.default) `
      SELECT
        MAKE_INTERVAL(1, day => 2, minute => 3)
    `);
    });
    // Issue #279
    describe('supports FROM clause operators:', () => {
        it('UNNEST operator', () => {
            expect(format('SELECT * FROM UNNEST ([1, 2, 3]);')).toBe((0, dedent_js_1.default) `
        SELECT
          *
        FROM
          UNNEST ([1, 2, 3]);
      `);
        });
        it('PIVOT operator', () => {
            expect(format(`SELECT * FROM Produce PIVOT(sales FOR quarter IN (Q1, Q2, Q3, Q4));`))
                .toBe((0, dedent_js_1.default) `
        SELECT
          *
        FROM
          Produce PIVOT(
            sales
            FOR quarter IN (Q1, Q2, Q3, Q4)
          );
      `);
        });
        it('UNPIVOT operator', () => {
            expect(format(`SELECT * FROM Produce UNPIVOT(sales FOR quarter IN (Q1, Q2, Q3, Q4));`))
                .toBe((0, dedent_js_1.default) `
        SELECT
          *
        FROM
          Produce UNPIVOT(
            sales
            FOR quarter IN (Q1, Q2, Q3, Q4)
          );
      `);
        });
        it('TABLESAMPLE SYSTEM operator', () => {
            expect(format(`SELECT * FROM dataset.my_table TABLESAMPLE SYSTEM (10 PERCENT);`)).toBe((0, dedent_js_1.default) `
        SELECT
          *
        FROM
          dataset.my_table TABLESAMPLE SYSTEM (10 PERCENT);
      `);
        });
    });
    it('supports trailing comma in SELECT clause', () => {
        expect(format(`SELECT foo, bar, FROM tbl;`)).toBe((0, dedent_js_1.default) `
      SELECT
        foo,
        bar,
      FROM
        tbl;
    `);
    });
    describe('BigQuery DDL Create Statements', () => {
        it(`Supports CREATE SCHEMA`, () => {
            const input = `
        CREATE SCHEMA mydataset
          DEFAULT COLLATE 'und:ci'
          OPTIONS(
            location="us", labels=[("label1","value1"),("label2","value2")])`;
            const expected = (0, dedent_js_1.default) `
        CREATE SCHEMA mydataset
        DEFAULT COLLATE 'und:ci' OPTIONS(
          location = "us",
          labels = [("label1", "value1"), ("label2", "value2")]
        )
      `;
            expect(format(input)).toBe(expected);
        });
        it(`Supports CREATE EXTERNAL TABLE ... WITH PARTITION COLUMN`, () => {
            const input = `
        CREATE EXTERNAL TABLE dataset.CsvTable
        WITH PARTITION COLUMNS (
          field_1 STRING,
          field_2 INT64
        )
        OPTIONS(
          format = 'CSV',
          uris = ['gs://bucket/path1.csv']
        )`;
            const expected = (0, dedent_js_1.default) `
        CREATE EXTERNAL TABLE dataset.CsvTable
        WITH PARTITION COLUMNS
          (field_1 STRING, field_2 INT64) OPTIONS(format = 'CSV', uris = ['gs://bucket/path1.csv'])`;
            expect(format(input)).toBe(expected);
        });
        it(`Supports CREATE FUNCTION`, () => {
            const input = `
        CREATE FUNCTION mydataset.myFunc(x FLOAT64, y FLOAT64)
        RETURNS FLOAT64
        AS (x * y);`;
            const expected = (0, dedent_js_1.default) `
        CREATE FUNCTION mydataset.myFunc (x FLOAT64, y FLOAT64) RETURNS FLOAT64 AS (x * y);`;
            expect(format(input)).toBe(expected);
        });
        it(`Supports CREATE FUNCTION - LANGUAGE js`, () => {
            const input = (0, dedent_js_1.default) `
        CREATE FUNCTION myFunc(x FLOAT64, y FLOAT64)
        RETURNS FLOAT64
        LANGUAGE js
        AS r"""
            return x*y;
          """;`;
            const expected = (0, dedent_js_1.default) `
        CREATE FUNCTION myFunc (x FLOAT64, y FLOAT64) RETURNS FLOAT64 LANGUAGE js AS r"""
            return x*y;
          """;`;
            expect(format(input)).toBe(expected);
        });
        it(`Supports CREATE TABLE FUNCTION`, () => {
            const input = `
        CREATE TABLE FUNCTION mydataset.names_by_year(y INT64)
        RETURNS TABLE<name STRING, year INT64>
        AS (
          SELECT year, name
          FROM mydataset.mytable
          WHERE year = y
        )`;
            // TODO: formatting for <name STRING, year INT64> can be improved
            const expected = (0, dedent_js_1.default) `
        CREATE TABLE FUNCTION mydataset.names_by_year (y INT64) RETURNS TABLE < name STRING,
        year INT64 > AS (
          SELECT
            year,
            name
          FROM
            mydataset.mytable
          WHERE
            year = y
        )`;
            expect(format(input)).toBe(expected);
        });
        // not correctly supported yet
        it(`Supports CREATE PROCEDURE`, () => {
            const input = `
        CREATE PROCEDURE myDataset.QueryTable()
        BEGIN
          SELECT * FROM anotherDataset.myTable;
        END;`;
            const expected = (0, dedent_js_1.default) `
        CREATE PROCEDURE myDataset.QueryTable ()
        BEGIN
        SELECT
          *
        FROM
          anotherDataset.myTable;

        END;`;
            expect(format(input)).toBe(expected);
        });
        it(`Supports CREATE ROW ACCESS POLICY`, () => {
            const input = `
        CREATE ROW ACCESS POLICY us_filter
        ON mydataset.table1
        GRANT TO ("group:abc@example.com", "user:hello@example.com")
        FILTER USING (Region="US")`;
            const expected = (0, dedent_js_1.default) `
        CREATE ROW ACCESS POLICY us_filter ON mydataset.table1
        GRANT TO ("group:abc@example.com", "user:hello@example.com")
        FILTER USING (Region = "US")`;
            expect(format(input)).toBe(expected);
        });
        [
            // Create statements using "AS JSON"
            'CREATE CAPACITY',
            'CREATE RESERVATION',
            'CREATE ASSIGNMENT',
        ].forEach(create => {
            it(`Supports ${create}`, () => {
                const input = (0, dedent_js_1.default) `
          ${create} admin_project.region-us.my-commitment
          AS JSON """{
              "slot_count": 100,
              "plan": "FLEX"
            }"""`;
                const expected = (0, dedent_js_1.default) `
          ${create} admin_project.region-us.my-commitment
          AS JSON """{
              "slot_count": 100,
              "plan": "FLEX"
            }"""`;
                expect(format(input)).toBe(expected);
            });
        });
        it(`Supports CREATE SEARCH INDEX`, () => {
            const input = `
        CREATE SEARCH INDEX my_index
        ON dataset.my_table(ALL COLUMNS);`;
            const expected = (0, dedent_js_1.default) `
        CREATE SEARCH INDEX my_index ON dataset.my_table (ALL COLUMNS);`;
            expect(format(input)).toBe(expected);
        });
    });
    describe('BigQuery DDL Alter Statements', () => {
        it(`Supports ALTER SCHEMA - SET DEFAULT COLLATE`, () => {
            const input = `
        ALTER SCHEMA mydataset
        SET DEFAULT COLLATE 'und:ci'`;
            const expected = (0, dedent_js_1.default) `
        ALTER SCHEMA mydataset
        SET DEFAULT COLLATE 'und:ci'`;
            expect(format(input)).toBe(expected);
        });
        it(`Supports ALTER SCHEMA - SET OPTIONS`, () => {
            const input = `
        ALTER SCHEMA mydataset
        SET OPTIONS(
          default_table_expiration_days=3.75
          )`;
            const expected = (0, dedent_js_1.default) `
        ALTER SCHEMA mydataset
        SET OPTIONS (default_table_expiration_days = 3.75)`;
            expect(format(input)).toBe(expected);
        });
        it(`Supports ALTER TABLE - SET OPTIONS`, () => {
            const input = `
        ALTER TABLE mydataset.mytable
        SET OPTIONS(
          expiration_timestamp=TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
        )`;
            const expected = (0, dedent_js_1.default) `
        ALTER TABLE mydataset.mytable
        SET OPTIONS (
          expiration_timestamp = TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
        )`;
            expect(format(input)).toBe(expected);
        });
        it(`Supports ALTER TABLE - SET DEFAULT COLLATE`, () => {
            const input = `
        ALTER TABLE mydataset.mytable
        SET DEFAULT COLLATE 'und:ci'`;
            const expected = (0, dedent_js_1.default) `
        ALTER TABLE mydataset.mytable
        SET DEFAULT COLLATE 'und:ci'`;
            expect(format(input)).toBe(expected);
        });
        it(`Supports ALTER COLUMN - SET OPTIONS`, () => {
            const input = `
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        SET OPTIONS (
          description="Price per unit"
        )`;
            const expected = (0, dedent_js_1.default) `
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        SET OPTIONS (description = "Price per unit")`;
            expect(format(input)).toBe(expected);
        });
        it(`Supports ALTER COLUMN - DROP NOT NULL`, () => {
            const input = `
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        DROP NOT NULL`;
            const expected = (0, dedent_js_1.default) `
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        DROP NOT NULL`;
            expect(format(input)).toBe(expected);
        });
        it(`Supports ALTER COLUMN - SET DATA TYPE`, () => {
            const input = `
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        SET DATA TYPE NUMERIC`;
            const expected = (0, dedent_js_1.default) `
        ALTER TABLE mydataset.mytable
        ALTER COLUMN price
        SET DATA TYPE NUMERIC`;
            expect(format(input)).toBe(expected);
        });
        it(`Supports ALTER VIEW - SET OPTIONS`, () => {
            const input = `
        ALTER VIEW mydataset.myview
        SET OPTIONS (
          expiration_timestamp=TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
        )`;
            const expected = (0, dedent_js_1.default) `
        ALTER VIEW mydataset.myview
        SET OPTIONS (
          expiration_timestamp = TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
        )`;
            expect(format(input)).toBe(expected);
        });
        it(`Supports ALTER BI_CAPACITY - SET OPTIONS`, () => {
            const input = `
        ALTER BI_CAPACITY my-project.region-us.default
        SET OPTIONS(
          size_gb = 250
        )`;
            const expected = (0, dedent_js_1.default) `
        ALTER BI_CAPACITY my-project.region-us.default
        SET OPTIONS (size_gb = 250)`;
            expect(format(input)).toBe(expected);
        });
    });
    describe('BigQuery DDL Drop Statements', () => {
        it(`Supports DROP clauses`, () => {
            const input = (0, dedent_js_1.default) `
        DROP SCHEMA mydataset.name;
        DROP VIEW mydataset.name;
        DROP FUNCTION mydataset.name;
        DROP TABLE FUNCTION mydataset.name;
        DROP PROCEDURE mydataset.name;
        DROP RESERVATION mydataset.name;
        DROP ASSIGNMENT mydataset.name;
        DROP SEARCH INDEX index2 ON mydataset.mytable;
        DROP mypolicy ON mydataset.mytable;
        DROP ALL ROW ACCESS POLICIES ON table_name;
      `;
            expect(format(input, { linesBetweenQueries: 0 })).toBe(input);
        });
    });
});
//# sourceMappingURL=bigquery.test.js.map