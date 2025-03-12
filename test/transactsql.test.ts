import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsAlterTable from './features/alterTable.js';
import supportsStrings from './features/strings.js';
import supportsBetween from './features/between.js';
import supportsOperators from './features/operators.js';
import supportsJoin from './features/join.js';
import supportsConstraints from './features/constraints.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsComments from './features/comments.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsParams from './options/param.js';
import supportsWindow from './features/window.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsInsertInto from './features/insertInto.js';
import supportsUpdate from './features/update.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsMergeInto from './features/mergeInto.js';
import supportsCreateView from './features/createView.js';
import supportsDataTypeCase from './options/dataTypeCase.js';

describe('TransactSqlFormatter', () => {
  const language = 'transactsql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { nestedBlockComments: true });
  supportsCreateView(format, { materialized: true });
  supportsCreateTable(format);
  supportsDropTable(format, { ifExists: true });
  supportsConstraints(format, ['SET NULL', 'SET DEFAULT', 'CASCADE', 'NO ACTION']);
  supportsAlterTable(format, {
    dropColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format, { withoutInto: true });
  supportsUpdate(format, { whereCurrentOf: true });
  supportsTruncateTable(format);
  supportsMergeInto(format);
  supportsStrings(format, ["N''", "''-qq"]);
  supportsIdentifiers(format, [`""-qq`, '[]']);
  supportsBetween(format);
  // Missing: `::` scope resolution operator (tested separately)
  supportsOperators(
    format,
    ['%', '&', '|', '^', '~', '!<', '!>', '+=', '-=', '*=', '/=', '%=', '|=', '&=', '^='],
    { any: true }
  );
  supportsJoin(format, { without: ['NATURAL'], supportsUsing: false, supportsApply: true });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT']);
  supportsParams(format, { named: ['@'], quoted: ['@""', '@[]'] });
  supportsWindow(format);
  supportsLimiting(format, { offset: true, fetchFirst: true, fetchNext: true });
  supportsDataTypeCase(format);

  it('supports language:tsql alias', () => {
    const result = originalFormat('SELECT [my column] FROM [my table];', { language: 'tsql' });
    expect(result).toBe(dedent`
      SELECT
        [my column]
      FROM
        [my table];
    `);
  });

  it('recognizes @, $, # as part of identifiers', () => {
    const result = format('SELECT from@bar, where#to, join$me FROM tbl;');
    expect(result).toBe(dedent`
      SELECT
        from@bar,
        where#to,
        join$me
      FROM
        tbl;
    `);
  });

  it('allows @ and # at the start of identifiers', () => {
    const result = format('SELECT @bar, #baz, @@some, ##flam FROM tbl;');
    expect(result).toBe(dedent`
      SELECT
        @bar,
        #baz,
        @@some,
        ##flam
      FROM
        tbl;
    `);
  });

  it('formats scope resolution operator without spaces', () => {
    expect(format('SELECT hierarchyid :: GetRoot();')).toBe(dedent`
      SELECT
        hierarchyid::GetRoot ();
    `);
  });

  it('formats .. shorthand for database.schema.table', () => {
    expect(format('SELECT x FROM db..tbl')).toBe(dedent`
      SELECT
        x
      FROM
        db..tbl
    `);
  });

  it('formats ALTER TABLE ... ALTER COLUMN', () => {
    expect(format(`ALTER TABLE t ALTER COLUMN foo INT NOT NULL DEFAULT 5;`)).toBe(dedent`
      ALTER TABLE t
      ALTER COLUMN foo INT NOT NULL DEFAULT 5;
    `);
  });

  it('formats GO CREATE OR ALTER PROCEDURE', () => {
    const result = format('GO CREATE OR ALTER PROCEDURE p');
    expect(result).toBe(dedent`
      GO
      CREATE OR ALTER PROCEDURE
        p
    `);
  });

  it('formats SELECT ... INTO clause', () => {
    const result = format('SELECT col INTO #temp FROM tbl');
    expect(result).toBe(dedent`
      SELECT
        col
      INTO
        #temp
      FROM
        tbl
    `);
  });

  it('formats SELECT ... OPTION ()', () => {
    const result = format('SELECT col OPTION (MAXRECURSION 5)');
    expect(result).toBe(dedent`
      SELECT
        col
      OPTION
        (MAXRECURSION 5)
    `);
  });

  it('formats SELECT ... FOR BROWSE', () => {
    expect(format('SELECT col FOR BROWSE')).toBe(dedent`
      SELECT
        col
      FOR BROWSE
    `);
  });

  it('formats SELECT ... FOR XML', () => {
    expect(format("SELECT col FOR XML PATH('Employee'), ROOT('Employees')")).toBe(dedent`
      SELECT
        col
      FOR XML
        PATH ('Employee'),
        ROOT ('Employees')
    `);
  });

  it('formats SELECT ... FOR JSON', () => {
    expect(format('SELECT col FOR JSON PATH, WITHOUT_ARRAY_WRAPPER')).toBe(dedent`
      SELECT
        col
      FOR JSON
        PATH,
        WITHOUT_ARRAY_WRAPPER
    `);
  });

  it('formats goto labels', () => {
    const result = format(
      `InfiniLoop:
      SELECT 'Hello.';
      GOTO InfiniLoop;`
    );
    expect(result).toBe(dedent`
      InfiniLoop:
      SELECT
        'Hello.';

      GOTO InfiniLoop;
    `);
  });

  // Issue #811
  it('does not detect CHAR() as function', () => {
    expect(format(`CREATE TABLE foo (name char(65));`, { functionCase: 'upper' })).toBe(dedent`
      CREATE TABLE foo (name char(65));
    `);
  });

  // Issue #810
  it('supports special $ACTION keyword', () => {
    expect(format(`MERGE INTO tbl OUTPUT $action AS act;`)).toBe(dedent`
      MERGE INTO
        tbl OUTPUT $action AS act;
    `);
  });

  // Issue #814
  it('formats GO on a separate line', () => {
    expect(format(`CREATE VIEW foo AS SELECT * FROM tbl GO CREATE INDEX bar`)).toBe(dedent`
      CREATE VIEW foo AS
      SELECT
        *
      FROM
        tbl
      GO
      CREATE INDEX bar
    `);
  });

  // Issue #819
  it('does not recognize ODBC keywords as reserved keywords', () => {
    expect(format(`SELECT Value, Zone`, { keywordCase: 'upper' })).toBe(dedent`
      SELECT
        Value,
        Zone
    `);
  });
});
