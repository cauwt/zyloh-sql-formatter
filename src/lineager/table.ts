import { Column } from "./column";

export interface TableIdentity {
    db?: string;                             // 数据库名称
    schema?: string;                         // 模式名称
    name: string;                           // 表名
    alias?: string;                         // 别名
  };

export interface Table {
    tableName: TableIdentity;                // 表名
    columns: Column[];                      // 字段列表
    sourceTables?: Table[];             // 表级血缘关系
    whereColumns?: Column[];         // where条件字段
    joinColumns?: Column[];          // join条件字段
    groupByColumns?: Column[];       // group by条件字段
  };
