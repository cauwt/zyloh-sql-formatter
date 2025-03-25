import { ColumnLineage } from './columnLineage';
import { Table } from './table';
// 定义血缘关系的返回结构
export interface TableLineage {
    target_table: Table;           // 目标表
    columnLineages: ColumnLineage[];         // 字段血缘关系列表
  }
  