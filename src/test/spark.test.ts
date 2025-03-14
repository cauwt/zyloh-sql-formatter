import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsAlterTable from '../src/test/features/alterTable.js';
import supportsBetween from '../src/test/features/between.js';
import supportsCreateTable from '../src/test/features/createTable.js';
import supportsDropTable from '../src/test/features/dropTable.js';
import supportsJoin from '../src/test/features/join.js';
import supportsOperators from '../src/test/features/operators.js';
import supportsStrings from '../src/test/features/strings.js';
import supportsArrayAndMapAccessors from '../src/test/features/arrayAndMapAccessors.js';
import supportsComments from '../src/test/features/comments.js';
import supportsIdentifiers from '../src/test/features/identifiers.js';
import supportsSetOperations from '../src/test/features/setOperations.js';
import supportsLimiting from '../src/test/features/limiting.js';
import supportsInsertInto from '../src/test/features/insertInto.js';
import supportsTruncateTable from '../src/test/features/truncateTable.js';
import supportsCreateView from '../src/test/features/createView.js';
import supportsDataTypeCase from '../src/test/options/dataTypeCase.js';

describe('SparkFormatter', () => {
  const language = 'spark';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateView(format, { orReplace: true, ifNotExists: true });
  supportsCreateTable(format, { ifNotExists: true, columnComment: true, tableComment: true });
  supportsDropTable(format, { ifExists: true });
  supportsAlterTable(format, {
    dropColumn: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsInsertInto(format, { withoutInto: true });
  supportsTruncateTable(format);
  supportsStrings(format, ["''-bs", '""-bs', "X''", 'X""', "R''", 'R""']);
  supportsIdentifiers(format, ['``']);
  supportsBetween(format);
  supportsOperators(format, ['%', '~', '^', '|', '&', '<=>', '==', '!', '||', '->'], {
    logicalOperators: ['AND', 'OR', 'XOR'],
    any: true,
  });
  supportsArrayAndMapAccessors(format);
  supportsJoin(format, {
    additionally: [
      // non-standard anti-join:
      'ANTI JOIN',
      'LEFT ANTI JOIN',
      'NATURAL ANTI JOIN',
      'NATURAL LEFT ANTI JOIN',
      // non-standard semi-join
      'SEMI JOIN',
      'LEFT SEMI JOIN',
      'NATURAL SEMI JOIN',
      'NATURAL LEFT SEMI JOIN',
    ],
  });
  supportsSetOperations(format);
  supportsLimiting(format, { limit: true });
  supportsDataTypeCase(format);

  it('formats basic WINDOW clause', () => {
    const result = format(`SELECT * FROM tbl WINDOW win1, WINDOW win2, WINDOW win3;`);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        tbl
      WINDOW
        win1,
      WINDOW
        win2,
      WINDOW
        win3;
    `);
  });

  it('formats window function and end as inline', () => {
    const result = format(
      `SELECT window(time, '1 hour').start AS window_start, window(time, '1 hour').end AS window_end FROM tbl;`
    );
    expect(result).toBe(dedent`
      SELECT
        window(time, '1 hour').start AS window_start,
        window(time, '1 hour').end AS window_end
      FROM
        tbl;
    `);
  });

  // eslint-disable-next-line no-template-curly-in-string
  it('recognizes ${name} substitution variables', () => {
    const result = format(
      // eslint-disable-next-line no-template-curly-in-string
      "SELECT ${var1}, ${ var 2 } FROM ${table_name} WHERE name = '${name}';"
    );
    expect(result).toBe(dedent`
      SELECT
        \${var1},
        \${ var 2 }
      FROM
        \${table_name}
      WHERE
        name = '\${name}';
    `);
  });

  it('supports SORT BY, CLUSTER BY, DISTRIBUTE BY', () => {
    const result = format(
      'SELECT value, count DISTRIBUTE BY count CLUSTER BY value SORT BY value, count;'
    );
    expect(result).toBe(dedent`
      SELECT
        value,
        count
      DISTRIBUTE BY
        count
      CLUSTER BY
        value
      SORT BY
        value,
        count;
    `);
  });

  it('formats ALTER TABLE ... ALTER COLUMN', () => {
    expect(format(`ALTER TABLE StudentInfo ALTER COLUMN FirstName COMMENT "new comment";`))
      .toBe(dedent`
      ALTER TABLE StudentInfo
      ALTER COLUMN FirstName COMMENT "new comment";
    `);
  });
});
