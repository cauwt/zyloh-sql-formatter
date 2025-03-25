export { supportedDialects, format, formatDialect } from './sqlFormatter';
export { expandPhrases } from './expandPhrases';
export { ConfigError } from './validateConfig';

// When adding a new dialect, be sure to add it to the list of exports below.
export { bigquery } from './languages/bigquery/bigquery.formatter';
export { db2 } from './languages/db2/db2.formatter';
export { db2i } from './languages/db2i/db2i.formatter';
export { hive } from './languages/hive/hive.formatter';
export { mariadb } from './languages/mariadb/mariadb.formatter';
export { mysql } from './languages/mysql/mysql.formatter';
export { tidb } from './languages/tidb/tidb.formatter';
export { n1ql } from './languages/n1ql/n1ql.formatter';
export { plsql } from './languages/plsql/plsql.formatter';
export { postgresql } from './languages/postgresql/postgresql.formatter';
export { redshift } from './languages/redshift/redshift.formatter';
export { spark } from './languages/spark/spark.formatter';
export { sqlite } from './languages/sqlite/sqlite.formatter';
export { sql } from './languages/sql/sql.formatter';
export { trino } from './languages/trino/trino.formatter';
export { transactsql } from './languages/transactsql/transactsql.formatter';
export { singlestoredb } from './languages/singlestoredb/singlestoredb.formatter';
export { snowflake } from './languages/snowflake/snowflake.formatter';

// NB! To re-export types the "export type" syntax is required by webpack.
// Otherwise webpack build will fail.
export type {
  SqlLanguage,
  FormatOptionsWithLanguage,
  FormatOptionsWithDialect,
} from './sqlFormatter';
export type {
  IndentStyle,
  KeywordCase,
  DataTypeCase,
  FunctionCase,
  IdentifierCase,
  LogicalOperatorNewline,
  FormatOptions,
} from './FormatOptions';
export type { ParamItems } from './formatter/Params';
export type { ParamTypes } from './lexer/TokenizerOptions';
export type { DialectOptions } from './dialect';
