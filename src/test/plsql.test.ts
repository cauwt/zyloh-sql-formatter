import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsAlterTable from '../src/test/features/alterTable.js';
import supportsBetween from '../src/test/features/between.js';
import supportsCreateTable from '../src/test/features/createTable.js';
import supportsDropTable from '../src/test/features/dropTable.js';
import supportsJoin from '../src/test/features/join.js';
import supportsOperators from '../src/test/features/operators.js';
import supportsSchema from '../src/test/features/schema.js';
import supportsStrings from '../src/test/features/strings.js';
import supportsReturning from '../src/test/features/returning.js';
import supportsConstraints from '../src/test/features/constraints.js';
import supportsDeleteFrom from '../src/test/features/deleteFrom.js';
import supportsComments from '../src/test/features/comments.js';
import supportsCommentOn from '../src/test/features/commentOn.js';
import supportsIdentifiers from '../src/test/features/identifiers.js';
import supportsParams from '../src/test/options/param.js';
import supportsSetOperations from '../src/test/features/setOperations.js';
import supportsLimiting from '../src/test/features/limiting.js';
import supportsInsertInto from '../src/test/features/insertInto.js';
import supportsUpdate from '../src/test/features/update.js';
import supportsTruncateTable from '../src/test/features/truncateTable.js';
import supportsMergeInto from '../src/test/features/mergeInto.js';
import supportsCreateView from '../src/test/features/createView.js';
import supportsDataTypeCase from '../src/test/options/dataTypeCase.js';

describe('PlSqlFormatter', () => {
  const language = 'plsql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCommentOn(format);
  supportsCreateView(format, { orReplace: true, materialized: true });
  supportsCreateTable(format);
  supportsDropTable(format);
  // http://dba-oracle.com/bk_on_delete_restrict_on_delete_no_action_tips.htm
  supportsConstraints(format, ['SET NULL', 'CASCADE', 'NO ACTION']);
  supportsAlterTable(format, {
    dropColumn: true,
    modify: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsUpdate(format);
  supportsTruncateTable(format);
  supportsMergeInto(format);
  supportsStrings(format, ["''-qq", "N''"]);
  supportsIdentifiers(format, [`""-qq`]);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(
    format,
    // Missing: '..' operator
    ['**', ':=', '%', '~=', '^=', '>>', '<<', '=>', '||'],
    {
      logicalOperators: ['AND', 'OR', 'XOR'],
      any: true,
    }
  );
  supportsJoin(format, { supportsApply: true });
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT']);
  supportsReturning(format);
  supportsParams(format, { numbered: [':'], named: [':'] });
  supportsLimiting(format, { offset: true, fetchFirst: true, fetchNext: true });
  supportsDataTypeCase(format);

  it('recognizes _, $, # as part of identifiers', () => {
    const result = format('SELECT my_col$1#, col.a$, type#, procedure$, user# FROM tbl;');
    expect(result).toBe(dedent`
      SELECT
        my_col$1#,
        col.a$,
        type#,
        procedure$,
        user#
      FROM
        tbl;
    `);
  });

  // Parameters don't allow the same characters as identifiers
  it('does not support #, $ in named parameters', () => {
    expect(() => format('SELECT :col$foo')).toThrowError(`Parse error: Unexpected "$foo"`);

    expect(() => format('SELECT :col#foo')).toThrowError(`Parse error: Unexpected "#foo"`);
  });

  it('supports &name substitution variables', () => {
    const result = format('SELECT &name, &some$Special#Chars_, &hah123 FROM &&tbl');
    expect(result).toBe(dedent`
      SELECT
        &name,
        &some$Special#Chars_,
        &hah123
      FROM
        &&tbl
    `);
  });

  it('supports Q custom delimiter strings', () => {
    expect(format("q'<test string < > 'foo' bar >'")).toBe("q'<test string < > 'foo' bar >'");
    expect(format("NQ'[test string [ ] 'foo' bar ]'")).toBe("NQ'[test string [ ] 'foo' bar ]'");
    expect(format("nq'(test string ( ) 'foo' bar )'")).toBe("nq'(test string ( ) 'foo' bar )'");
    expect(format("nQ'{test string { } 'foo' bar }'")).toBe("nQ'{test string { } 'foo' bar }'");
    expect(format("Nq'%test string % % 'foo' bar %'")).toBe("Nq'%test string % % 'foo' bar %'");
    expect(format("Q'Xtest string X X 'foo' bar X'")).toBe("Q'Xtest string X X 'foo' bar X'");
    expect(() => format("q'$test string $'$''")).toThrowError(`Parse error: Unexpected "$''"`);
    expect(format("Q'Stest string S'S''")).toBe("Q'Stest string S' S ''");
  });

  it('formats Oracle recursive sub queries', () => {
    const result = format(`
      WITH t1 AS (
        SELECT * FROM tbl
      ) SEARCH BREADTH FIRST BY id SET order1
      SELECT * FROM t1;
    `);
    expect(result).toBe(dedent`
      WITH
        t1 AS (
          SELECT
            *
          FROM
            tbl
        ) SEARCH BREADTH FIRST BY id SET order1
      SELECT
        *
      FROM
        t1;
    `);
  });

  // regression test for sql-formatter#338
  it('formats identifier with dblink', () => {
    const result = format('SELECT * FROM database.table@dblink WHERE id = 1;');
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        database.table@dblink
      WHERE
        id = 1;
    `);
  });

  // regression test for #340
  it('formats FOR UPDATE clause', () => {
    const result = format(`
      SELECT * FROM tbl FOR UPDATE;
      SELECT * FROM tbl FOR UPDATE OF tbl.salary;
    `);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        tbl
      FOR UPDATE;

      SELECT
        *
      FROM
        tbl
      FOR UPDATE OF
        tbl.salary;
    `);
  });
});
