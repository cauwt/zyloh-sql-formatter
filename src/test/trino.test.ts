import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsArrayLiterals from '../src/test/features/arrayLiterals.js';
import supportsBetween from '../src/test/features/between.js';
import supportsCreateTable from '../src/test/features/createTable.js';
import supportsDropTable from '../src/test/features/dropTable.js';
import supportsDeleteFrom from '../src/test/features/deleteFrom.js';
import supportsJoin from '../src/test/features/join.js';
import supportsOperators from '../src/test/features/operators.js';
import supportsStrings from '../src/test/features/strings.js';
import supportsArrayAndMapAccessors from '../src/test/features/arrayAndMapAccessors.js';
import supportsComments from '../src/test/features/comments.js';
import supportsCommentOn from '../src/test/features/commentOn.js';
import supportsIdentifiers from '../src/test/features/identifiers.js';
import supportsParams from '../src/test/options/param.js';
import supportsSetOperations from '../src/test/features/setOperations.js';
import supportsWindow from '../src/test/features/window.js';
import supportsLimiting from '../src/test/features/limiting.js';
import supportsInsertInto from '../src/test/features/insertInto.js';
import supportsUpdate from '../src/test/features/update.js';
import supportsTruncateTable from '../src/test/features/truncateTable.js';
import supportsCreateView from '../src/test/features/createView.js';
import supportsAlterTable from '../src/test/features/alterTable.js';
import supportsIsDistinctFrom from '../src/test/features/isDistinctFrom.js';
import supportsDataTypeCase from '../src/test/options/dataTypeCase.js';

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
