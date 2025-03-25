import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter';;
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsArrayLiterals from './features/arrayLiterals';
import supportsBetween from './features/between';
import supportsCreateTable from './features/createTable';
import supportsDropTable from './features/dropTable';
import supportsDeleteFrom from './features/deleteFrom';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsStrings from './features/strings';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors';
import supportsComments from './features/comments';
import supportsCommentOn from './features/commentOn';
import supportsIdentifiers from './features/identifiers';
import supportsParams from './options/param';
import supportsSetOperations from './features/setOperations';
import supportsWindow from './features/window';
import supportsLimiting from './features/limiting';
import supportsInsertInto from './features/insertInto';
import supportsUpdate from './features/update';
import supportsTruncateTable from './features/truncateTable';
import supportsCreateView from './features/createView';
import supportsAlterTable from './features/alterTable';
import supportsIsDistinctFrom from './features/isDistinctFrom';
import supportsDataTypeCase from './options/dataTypeCase';

describe('TrinoFormatter', () => {
  const language = 'trino';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCommentOn(format);
  supportsCreateView(format, { orReplace: true, materialized: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsUpdate(format);
  supportsTruncateTable(format);
  supportsStrings(format, ["''-qq", "X''", "U&''"]);
  supportsIdentifiers(format, [`""-qq`]);
  supportsBetween(format);
  // Missing: '?' operator (for row patterns)
  supportsOperators(format, ['%', '->', '=>', '||', '|', '^', '$'], { any: true });
  supportsIsDistinctFrom(format);
  supportsArrayLiterals(format, { withArrayPrefix: true });
  supportsArrayAndMapAccessors(format);
  supportsJoin(format);
  supportsSetOperations(format);
  supportsParams(format, { positional: true });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });
  supportsDataTypeCase(format);

  it('formats SET SESSION', () => {
    const result = format('SET SESSION foo = 444;');
    expect(result).toBe(dedent`
      SET SESSION foo = 444;
    `);
  });

  it('formats row PATTERN()s', () => {
    const result = format(`
      SELECT * FROM orders MATCH_RECOGNIZE(
        PARTITION BY custkey
        ORDER BY orderdate
        MEASURES
                  A.totalprice AS starting_price,
                  LAST(B.totalprice) AS bottom_price,
                  LAST(U.totalprice) AS top_price
        ONE ROW PER MATCH
        AFTER MATCH SKIP PAST LAST ROW
        PATTERN ((A | B){5} {- C+ D+ -} E+)
        SUBSET U = (C, D)
        DEFINE
                  B AS totalprice < PREV(totalprice),
                  C AS totalprice > PREV(totalprice) AND totalprice <= A.totalprice,
                  D AS totalprice > PREV(totalprice)
        )
    `);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        orders
      MATCH_RECOGNIZE
        (
          PARTITION BY
            custkey
          ORDER BY
            orderdate
          MEASURES
            A.totalprice AS starting_price,
            LAST(B.totalprice) AS bottom_price,
            LAST(U.totalprice) AS top_price
          ONE ROW PER MATCH
          AFTER MATCH
            SKIP PAST LAST ROW
          PATTERN
            ((A | B) {5} {- C + D + -} E +)
          SUBSET
            U = (C, D)
          DEFINE
            B AS totalprice < PREV(totalprice),
            C AS totalprice > PREV(totalprice)
            AND totalprice <= A.totalprice,
            D AS totalprice > PREV(totalprice)
        )
    `);
  });
});
