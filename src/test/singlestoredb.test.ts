import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter.js';

import supportsJoin from '../src/test/features/join.js';
import supportsOperators from '../src/test/features/operators.js';
import supportsSetOperations from '../src/test/features/setOperations.js';
import supportsLimiting from '../src/test/features/limiting.js';
import supportsCreateTable from '../src/test/features/createTable.js';
import supportsCreateView from '../src/test/features/createView.js';
import supportsAlterTable from '../src/test/features/alterTable.js';
import supportsStrings from '../src/test/features/strings.js';
import supportsDataTypeCase from '../src/test/options/dataTypeCase.js';

describe('SingleStoreDbFormatter', () => {
  const language = 'singlestoredb';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeMariaDbFormatter(format);

  // in addition to string types listed in behavesLikeMariaDbFormatter
  supportsStrings(format, ["B''"]);

  supportsJoin(format, {
    without: ['NATURAL INNER JOIN', 'NATURAL FULL', 'NATURAL JOIN'],
    additionally: ['STRAIGHT_JOIN'],
  });
  supportsSetOperations(format, [
    'UNION',
    'UNION ALL',
    'UNION DISTINCT',
    'EXCEPT',
    'INTERSECT',
    'MINUS',
  ]);
  supportsOperators(
    format,
    [':=', '&', '|', '^', '~', '<<', '>>', '<=>', '&&', '||', ':>', '!:>'],
    { any: true }
  );
  supportsLimiting(format, { limit: true, offset: true });
  supportsCreateTable(format, { ifNotExists: true, columnComment: true, tableComment: true });
  supportsCreateView(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    modify: true,
    renameTo: true,
  });
  supportsDataTypeCase(format);

  describe(`formats traversal of semi structured data`, () => {
    it(`formats '::' path-operator without spaces`, () => {
      expect(format(`SELECT * FROM foo WHERE json_foo::bar = 'foobar'`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        WHERE
          json_foo::bar = 'foobar'
      `);
    });
    it(`formats '::$' conversion path-operator without spaces`, () => {
      expect(format(`SELECT * FROM foo WHERE json_foo::$bar = 'foobar'`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        WHERE
          json_foo::$bar = 'foobar'
      `);
    });
    it(`formats '::%' conversion path-operator without spaces`, () => {
      expect(format(`SELECT * FROM foo WHERE json_foo::%bar = 'foobar'`)).toBe(dedent`
        SELECT
          *
        FROM
          foo
        WHERE
          json_foo::%bar = 'foobar'
      `);
    });
  });
});
