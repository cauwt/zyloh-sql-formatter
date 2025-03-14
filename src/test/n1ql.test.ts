import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';
import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';

import supportsBetween from '../src/test/features/between.js';
import supportsJoin from '../src/test/features/join.js';
import supportsOperators from '../src/test/features/operators.js';
import supportsSchema from '../src/test/features/schema.js';
import supportsStrings from '../src/test/features/strings.js';
import supportsReturning from '../src/test/features/returning.js';
import supportsDeleteFrom from '../src/test/features/deleteFrom.js';
import supportsArrayAndMapAccessors from '../src/test/features/arrayAndMapAccessors.js';
import supportsArrayLiterals from '../src/test/features/arrayLiterals.js';
import supportsComments from '../src/test/features/comments.js';
import supportsIdentifiers from '../src/test/features/identifiers.js';
import supportsParams from '../src/test/options/param.js';
import supportsWindow from '../src/test/features/window.js';
import supportsSetOperations from '../src/test/features/setOperations.js';
import supportsLimiting from '../src/test/features/limiting.js';
import supportsInsertInto from '../src/test/features/insertInto.js';
import supportsUpdate from '../src/test/features/update.js';
import supportsMergeInto from '../src/test/features/mergeInto.js';

describe('N1qlFormatter', () => {
  const language = 'n1ql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { hashComments: true });
  supportsDeleteFrom(format);
  supportsStrings(format, [`""-bs`]);
  supportsIdentifiers(format, ['``']);
  supportsBetween(format);
  supportsSchema(format);
  supportsOperators(format, ['%', '==', '||'], {
    logicalOperators: ['AND', 'OR', 'XOR'],
    any: true,
  });
  supportsArrayAndMapAccessors(format);
  supportsArrayLiterals(format, { withoutArrayPrefix: true });
  supportsJoin(format, { without: ['FULL', 'CROSS', 'NATURAL'], supportsUsing: false });
  supportsSetOperations(format, [
    'UNION',
    'UNION ALL',
    'EXCEPT',
    'EXCEPT ALL',
    'INTERSECT',
    'INTERSECT ALL',
  ]);
  supportsReturning(format);
  supportsParams(format, { positional: true, numbered: ['$'], named: ['$'] });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true });
  supportsInsertInto(format);
  supportsUpdate(format);
  supportsMergeInto(format);

  it('formats INSERT with {} object literal', () => {
    const result = format(
      "INSERT INTO heroes (KEY, VALUE) VALUES ('123', {'id':1,'type':'Tarzan'});"
    );
    expect(result).toBe(dedent`
      INSERT INTO
        heroes (KEY, VALUE)
      VALUES
        ('123', {'id': 1, 'type': 'Tarzan'});
    `);
  });

  it('formats INSERT with large object and array literals', () => {
    const result = format(`
      INSERT INTO heroes (KEY, VALUE) VALUES ('123', {'id': 1, 'type': 'Tarzan',
      'array': [123456789, 123456789, 123456789, 123456789, 123456789], 'hello': 'world'});
    `);
    expect(result).toBe(dedent`
      INSERT INTO
        heroes (KEY, VALUE)
      VALUES
        (
          '123',
          {
            'id': 1,
            'type': 'Tarzan',
            'array': [
              123456789,
              123456789,
              123456789,
              123456789,
              123456789
            ],
            'hello': 'world'
          }
        );
    `);
  });

  it('formats SELECT query with UNNEST top level reserver word', () => {
    const result = format('SELECT * FROM tutorial UNNEST tutorial.children c;');
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        tutorial
      UNNEST
        tutorial.children c;
    `);
  });

  it('formats SELECT query with NEST and USE KEYS', () => {
    const result = format(`
      SELECT * FROM usr
      USE KEYS 'Elinor_33313792' NEST orders_with_users orders
      ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history END;
    `);
    expect(result).toBe(dedent`
      SELECT
        *
      FROM
        usr
      USE KEYS 'Elinor_33313792'
      NEST
        orders_with_users orders ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history END;
    `);
  });

  it('formats explained DELETE query with USE KEYS', () => {
    const result = format("EXPLAIN DELETE FROM tutorial t USE KEYS 'baldwin'");
    expect(result).toBe(dedent`
      EXPLAIN
      DELETE FROM tutorial t
      USE KEYS 'baldwin'
    `);
  });

  it('formats UPDATE query with USE KEYS', () => {
    const result = format("UPDATE tutorial USE KEYS 'baldwin' SET type = 'actor'");
    expect(result).toBe(dedent`
      UPDATE tutorial
      USE KEYS 'baldwin'
      SET
        type = 'actor'
    `);
  });
});
