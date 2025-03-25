import { DialectOptions } from '../../dialect';
import { expandPhrases } from '../../expandPhrases';
import { functions } from './sql.functions';
import { dataTypes, keywords } from './sql.keywords';

const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT]']);

const reservedClauses = expandPhrases([
  // queries
  'WITH [RECURSIVE]',
  'FROM',
  'WHERE',
  'GROUP BY [ALL | DISTINCT]',
  'HAVING',
  'WINDOW',
  'PARTITION BY',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  'FETCH {FIRST | NEXT}',
  // Data manipulation
  // - insert:
  'INSERT INTO',
  'VALUES',
  // - update:
  'SET',
]);

const standardOnelineClauses = expandPhrases(['CREATE [GLOBAL TEMPORARY | LOCAL TEMPORARY] TABLE']);

const tabularOnelineClauses = expandPhrases([
  // - create:
  'CREATE [RECURSIVE] VIEW',
  // - update:
  'UPDATE',
  'WHERE CURRENT OF',
  // - delete:
  'DELETE FROM',
  // - drop table:
  'DROP TABLE',
  // - alter table:
  'ALTER TABLE',
  'ADD COLUMN',
  'DROP [COLUMN]',
  'RENAME COLUMN',
  'RENAME TO',
  'ALTER [COLUMN]',
  '{SET | DROP} DEFAULT', // for alter column
  'ADD SCOPE', // for alter column
  'DROP SCOPE {CASCADE | RESTRICT}', // for alter column
  'RESTART WITH', // for alter column
  // - truncate:
  'TRUNCATE TABLE',
  // other
  'SET SCHEMA',
]);

const reservedSetOperations = expandPhrases([
  'UNION [ALL | DISTINCT]',
  'EXCEPT [ALL | DISTINCT]',
  'INTERSECT [ALL | DISTINCT]',
]);

const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
  'NATURAL [INNER] JOIN',
  'NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN',
]);

const reservedPhrases = expandPhrases([
  'ON {UPDATE | DELETE} [SET NULL | SET DEFAULT]',
  '{ROWS | RANGE} BETWEEN',
]);

export const sql: DialectOptions = {
  name: 'sql',
  tokenizerOptions: {
    reservedSelect,
    reservedClauses: [...reservedClauses, ...standardOnelineClauses, ...tabularOnelineClauses],
    reservedSetOperations,
    reservedJoins,
    reservedPhrases,
    reservedKeywords: keywords,
    reservedDataTypes: dataTypes,
    reservedFunctionNames: functions,
    stringTypes: [
      { quote: "''-qq-bs", prefixes: ['N', 'U&'] },
      { quote: "''-raw", prefixes: ['X'], requirePrefix: true },
    ],
    identTypes: [`""-qq`, '``'],
    paramTypes: { positional: true },
    operators: ['||'],
  },
  formatOptions: {
    onelineClauses: [...standardOnelineClauses, ...tabularOnelineClauses],
    tabularOnelineClauses,
  },
};
