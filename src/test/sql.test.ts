import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsCreateTable from '../src/test/features/createTable.js';
import supportsDropTable from '../src/test/features/dropTable.js';
import supportsAlterTable from '../src/test/features/alterTable.js';
import supportsSchema from '../src/test/features/schema.js';
import supportsStrings from '../src/test/features/strings.js';
import supportsBetween from '../src/test/features/between.js';
import supportsJoin from '../src/test/features/join.js';
import supportsOperators from '../src/test/features/operators.js';
import supportsConstraints from '../src/test/features/constraints.js';
import supportsDeleteFrom from '../src/test/features/deleteFrom.js';
import supportsComments from '../src/test/features/comments.js';
import supportsIdentifiers from '../src/test/features/identifiers.js';
import supportsParams from '../src/test/options/param.js';
import supportsWindow from '../src/test/features/window.js';
import supportsSetOperations from '../src/test/features/setOperations.js';
import supportsLimiting from '../src/test/features/limiting.js';
import supportsInsertInto from '../src/test/features/insertInto.js';
import supportsUpdate from '../src/test/features/update.js';
import supportsTruncateTable from '../src/test/features/truncateTable.js';
import supportsCreateView from '../src/test/features/createView.js';
import supportsDataTypeCase from '../src/test/options/dataTypeCase.js';

describe('SqlFormatter', () => {
  const language = 'sql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateView(format);
  supportsCreateTable(format);
  supportsDropTable(format);
  supportsConstraints(format, ['CASCADE', 'SET NULL', 'SET DEFAULT', 'RESTRICT', 'NO ACTION']);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsUpdate(format, { whereCurrentOf: true });
  supportsTruncateTable(format);
  supportsStrings(format, ["''-qq", "''-bs", "X''", "N''", "U&''"]);
  supportsIdentifiers(format, [`""-qq`, '``']);
  supportsBetween(format);
  supportsSchema(format);
  supportsJoin(format);
  supportsSetOperations(format);
  supportsOperators(format, ['||'], { any: true });
  supportsParams(format, { positional: true });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });
  supportsDataTypeCase(format);

  it('throws error when encountering characters or operators it does not recognize', () => {
    expect(() => format('SELECT @name, :bar FROM foo;')).toThrowError(
      `Parse error: Unexpected "@name, :ba" at line 1 column 8`
    );
  });

  it('crashes when encountering unsupported curly braces', () => {
    expect(() =>
      format(dedent`
        SELECT
          {foo};
      `)
    ).toThrowError('Parse error: Unexpected "{foo};" at line 2 column 3');
  });

  // Issue #702
  it('treats ASC and DESC as reserved keywords', () => {
    expect(format(`SELECT foo FROM bar ORDER BY foo asc, zap desc`, { keywordCase: 'upper' }))
      .toBe(dedent`
        SELECT
          foo
        FROM
          bar
        ORDER BY
          foo ASC,
          zap DESC
      `);
  });

  it('formats ALTER TABLE ... ALTER COLUMN', () => {
    expect(
      format(
        `ALTER TABLE t ALTER COLUMN foo SET DEFAULT 5;
         ALTER TABLE t ALTER COLUMN foo DROP DEFAULT;
         ALTER TABLE t ALTER COLUMN foo DROP SCOPE CASCADE;
         ALTER TABLE t ALTER COLUMN foo RESTART WITH 10;`
      )
    ).toBe(dedent`
      ALTER TABLE t
      ALTER COLUMN foo
      SET DEFAULT 5;

      ALTER TABLE t
      ALTER COLUMN foo
      DROP DEFAULT;

      ALTER TABLE t
      ALTER COLUMN foo
      DROP SCOPE CASCADE;

      ALTER TABLE t
      ALTER COLUMN foo
      RESTART WITH 10;
    `);
  });
});
