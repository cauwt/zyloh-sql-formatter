import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';

import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsCreateTable from '../src/test/features/createTable.js';
import supportsDropTable from '../src/test/features/dropTable.js';
import supportsAlterTable from '../src/test/features/alterTable.js';
import supportsStrings from '../src/test/features/strings.js';
import supportsBetween from '../src/test/features/between.js';
import supportsJoin from '../src/test/features/join.js';
import supportsOperators from '../src/test/features/operators.js';
import supportsArrayAndMapAccessors from '../src/test/features/arrayAndMapAccessors.js';
import supportsComments from '../src/test/features/comments.js';
import supportsIdentifiers from '../src/test/features/identifiers.js';
import supportsWindow from '../src/test/features/window.js';
import supportsSetOperations from '../src/test/features/setOperations.js';
import supportsLimiting from '../src/test/features/limiting.js';
import supportsUpdate from '../src/test/features/update.js';
import supportsDeleteFrom from '../src/test/features/deleteFrom.js';
import supportsTruncateTable from '../src/test/features/truncateTable.js';
import supportsMergeInto from '../src/test/features/mergeInto.js';
import supportsCreateView from '../src/test/features/createView.js';
import supportsDataTypeCase from '../src/test/options/dataTypeCase.js';

describe('HiveFormatter', () => {
  const language = 'hive';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateView(format, { materialized: true, ifNotExists: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsAlterTable(format, { renameTo: true });
  supportsUpdate(format);
  supportsDeleteFrom(format);
  supportsTruncateTable(format, { withoutTable: true });
  supportsMergeInto(format);
  supportsStrings(format, ['""-bs', "''-bs"]);
  supportsIdentifiers(format, ['``']);
  supportsBetween(format);
  supportsJoin(format, {
    without: ['NATURAL'],
    additionally: ['LEFT SEMI JOIN'],
    supportsUsing: false,
  });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'UNION DISTINCT']);
  supportsOperators(format, ['%', '~', '^', '|', '&', '<=>', '==', '!', '||'], { any: true });
  supportsArrayAndMapAccessors(format);
  supportsWindow(format);
  supportsLimiting(format, { limit: true });
  supportsDataTypeCase(format);

  // eslint-disable-next-line no-template-curly-in-string
  it('recognizes ${hivevar:name} substitution variables', () => {
    const result = format(
      // eslint-disable-next-line no-template-curly-in-string
      "SELECT ${var1}, ${ var 2 } FROM ${hivevar:table_name} WHERE name = '${hivevar:name}';"
    );
    expect(result).toBe(dedent`
      SELECT
        \${var1},
        \${ var 2 }
      FROM
        \${hivevar:table_name}
      WHERE
        name = '\${hivevar:name}';
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

  it('formats INSERT INTO TABLE', () => {
    const result = format("INSERT INTO TABLE Customers VALUES (12,-123.4, 'Skagen 2111','Stv');");
    expect(result).toBe(dedent`
      INSERT INTO TABLE
        Customers
      VALUES
        (12, -123.4, 'Skagen 2111', 'Stv');
    `);
  });
});
