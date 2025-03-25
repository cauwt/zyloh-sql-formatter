import * as allDialects from './allDialects';
import { ConfigError } from './validateConfig';
import { createDialect } from './dialect';
import Lineager from './lineager/Lineager';
import { ColumnLineage } from './lineager/columnLineage';
import { TableLineage } from './lineager/tableLineage';

// 定义血缘分析的配置选项
export interface LineageOptions {
  includeSubqueries?: boolean;    // 是否包含子查询的血缘关系
  includeViews?: boolean;         // 是否包含视图的血缘关系
  includeCTE?: boolean;           // 是否包含CTE的血缘关系
  dynmicSQL?: boolean;            // 是否包含动态SQL的血缘关系
}


const defaultOptions: LineageOptions = {
  includeSubqueries: true,
  includeViews: true,
  includeCTE: true,
  dynmicSQL: false,
};

const dialectNameMap: Record<keyof typeof allDialects | 'tsql', keyof typeof allDialects> = {
    bigquery: 'bigquery',
    db2: 'db2',
    db2i: 'db2i',
    hive: 'hive',
    mariadb: 'mariadb',
    mysql: 'mysql',
    n1ql: 'n1ql',
    plsql: 'plsql',
    postgresql: 'postgresql',
    redshift: 'redshift',
    spark: 'spark',
    sqlite: 'sqlite',
    sql: 'sql',
    tidb: 'tidb',
    trino: 'trino',
    transactsql: 'transactsql',
    tsql: 'transactsql', // alias for transactsq
    singlestoredb: 'singlestoredb',
    snowflake: 'snowflake',
  };
  
  export const supportedDialects = Object.keys(dialectNameMap);
  export type SqlLanguage = keyof typeof dialectNameMap;
  
/**
 * 提取SQL查询中的字段血缘关系
 * 
 * @param {string} query - 输入的SQL查询语句
 * @param {object} cfg - 配置选项，包含language和其他血缘分析选项
 * @return {TableLineage[]} 字段血缘关系列表
 */
export const lineager = (
  query: string,
  cfg: Partial<LineageOptions> & { language?: SqlLanguage } = {}
): TableLineage[] => {
  if (typeof query !== 'string') {
    throw new Error('Invalid query argument. Expected string, instead got ' + typeof query);
  }

  // 验证SQL方言
  if (typeof cfg.language === 'string' && !supportedDialects.includes(cfg.language)) {
    throw new ConfigError(`Unsupported SQL dialect: ${cfg.language}`);
  }

  const canonicalDialectName = dialectNameMap[cfg.language || 'sql'];
  const options = {
    ...defaultOptions,
    ...cfg,
  };

  // 创建血缘分析器实例并执行分析
  return new Lineager(
    createDialect(allDialects[canonicalDialectName]),
    options
  ).analyze(query);
}; 