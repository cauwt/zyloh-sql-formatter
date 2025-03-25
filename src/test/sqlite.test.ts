import dedent from 'dedent-js';
import { format as originalFormat, FormatFn } from '../sqlFormatter';;
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter';

import supportsCreateTable from './features/createTable';
import supportsDropTable from './features/dropTable';
import supportsAlterTable from './features/alterTable';
import supportsSchema from './features/schema';
import supportsStrings from './features/strings';
import supportsBetween from './features/between';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsConstraints from './features/constraints';
import supportsDeleteFrom from './features/deleteFrom';
import supportsComments from './features/comments';
import supportsIdentifiers from './features/identifiers';
import supportsParams from './options/param';
import supportsWindow from './features/window';
import supportsSetOperations from './features/setOperations';
import supportsLimiting from './features/limiting';
import supportsInsertInto from './features/insertInto';
import supportsUpdate from './features/update';
import supportsCreateView from './features/createView';
import supportsOnConflict from './features/onConflict';
import supportsDataTypeCase from './options/dataTypeCase';

describe('SqliteFormatter', () => {
  const language = 'sqlite';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format);
  supportsCreateView(format, { ifNotExists: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsConstraints(format, ['SET NULL', 'SET DEFAULT', 'CASCADE', 'RESTRICT', 'NO ACTION']);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsOnConflict(format);
  supportsUpdate(format);
  supportsStrings(format, ["''-qq", "X''"]);
  supportsIdentifiers(format, [`""-qq`, '``', '[]']);
  supportsBetween(format);
  supportsSchema(format);
  supportsJoin(format);
  supportsSetOperations(format, ['UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT']);
  supportsOperators(format, ['%', '~', '&', '|', '<<', '>>', '==', '->', '->>', '||']);
  supportsParams(format, { positional: true, numbered: ['?'], named: [':', '$', '@'] });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true });
  supportsDataTypeCase(format);

  it('supports REPLACE INTO syntax', () => {
    expect(format(`REPLACE INTO tbl VALUES (1,'Leopard'),(2,'Dog');`)).toBe(dedent`
      REPLACE INTO
        tbl
      VALUES
        (1, 'Leopard'),
        (2, 'Dog');
    `);
  });

  it('supports ON CONFLICT .. DO UPDATE syntax', () => {
    expect(format(`INSERT INTO tbl VALUES (1,'Leopard') ON CONFLICT DO UPDATE SET foo=1;`))
      .toBe(dedent`
      INSERT INTO
        tbl
      VALUES
        (1, 'Leopard')
      ON CONFLICT DO UPDATE
      SET
        foo = 1;
    `);
  });
});
