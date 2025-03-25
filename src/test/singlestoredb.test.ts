import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../sqlFormatter';;
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsSetOperations from './features/setOperations';
import supportsLimiting from './features/limiting';
import supportsCreateTable from './features/createTable';
import supportsCreateView from './features/createView';
import supportsAlterTable from './features/alterTable';
import supportsStrings from './features/strings';
import supportsDataTypeCase from './options/dataTypeCase';

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
