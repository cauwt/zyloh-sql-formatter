import dedent from 'dedent-js';

import { FormatFn } from '../sqlFormatter';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsBetween from './features/between';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsConstraints from './features/constraints';
import supportsDeleteFrom from './features/deleteFrom';
import supportsCommentOn from './features/commentOn';
import supportsIdentifiers from './features/identifiers';
import supportsParams from './options/param';
import supportsSetOperations from './features/setOperations';
import supportsInsertInto from './features/insertInto';
import supportsUpdate from './features/update';
import supportsTruncateTable from './features/truncateTable';
import supportsMergeInto from './features/mergeInto';
import supportsCreateView from './features/createView';
import supportsArrayLiterals from './features/arrayLiterals';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors';

/**
 * Shared tests for DB2 and DB2i
 */
export default function behavesLikeDb2Formatter(format: FormatFn) {
  behavesLikeSqlFormatter(format);
  supportsCommentOn(format);
  supportsCreateView(format, { orReplace: true });
  supportsConstraints(format, ['NO ACTION', 'RESTRICT', 'CASCADE', 'SET NULL']);
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsUpdate(format, { whereCurrentOf: true });
  supportsTruncateTable(format, { withoutTable: true });
  supportsMergeInto(format);
  supportsStrings(format, ["''-qq", "X''", "N''"]);
  supportsIdentifiers(format, [`""-qq`]);
  supportsBetween(format);
  supportsSchema(format);
  supportsSetOperations(format, [
    'UNION',
    'UNION ALL',
    'EXCEPT',
    'EXCEPT ALL',
    'INTERSECT',
    'INTERSECT ALL',
  ]);
  supportsParams(format, { positional: true, named: [':'] });
  supportsArrayLiterals(format, { withArrayPrefix: true });
  supportsArrayAndMapAccessors(format);

  it('formats only -- as a line comment', () => {
    const result = format(`
      SELECT col FROM
      -- This is a comment
      MyTable;
    `);
    expect(result).toBe(dedent`
      SELECT
        col
      FROM
        -- This is a comment
        MyTable;
    `);
  });

  // DB2-specific string types
  it('supports strings with G, GX, BX, UX prefixes', () => {
    expect(format(`SELECT G'blah blah', GX'01AC', BX'0101', UX'CCF239' FROM foo`)).toBe(dedent`
      SELECT
        G'blah blah',
        GX'01AC',
        BX'0101',
        UX'CCF239'
      FROM
        foo
    `);
  });

  it('supports @, #, $ characters anywhere inside identifiers', () => {
    expect(format(`SELECT @foo, #bar, $zap, fo@o, ba#2, za$3`)).toBe(dedent`
      SELECT
        @foo,
        #bar,
        $zap,
        fo@o,
        ba#2,
        za$3
    `);
  });

  it('supports @, #, $ characters in named parameters', () => {
    expect(format(`SELECT :foo@bar, :foo#bar, :foo$bar, :@zip, :#zap, :$zop`)).toBe(dedent`
      SELECT
        :foo@bar,
        :foo#bar,
        :foo$bar,
        :@zip,
        :#zap,
        :$zop
    `);
  });

  it('supports WITH isolation level modifiers for UPDATE statement', () => {
    expect(format('UPDATE foo SET x = 10 WITH CS')).toBe(dedent`
      UPDATE foo
      SET
        x = 10
      WITH CS
    `);
  });

  it('formats ALTER TABLE ... ALTER COLUMN', () => {
    expect(
      format(
        `ALTER TABLE t ALTER COLUMN foo SET DATA TYPE VARCHAR;
         ALTER TABLE t ALTER COLUMN foo SET NOT NULL;`
      )
    ).toBe(dedent`
      ALTER TABLE t
      ALTER COLUMN foo
      SET DATA TYPE VARCHAR;

      ALTER TABLE t
      ALTER COLUMN foo
      SET NOT NULL;
    `);
  });
}
