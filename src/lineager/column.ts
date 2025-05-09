import { TableIdentity } from "./table";

export interface Column {
    tableName: TableIdentity; // 表名
    name: string;
    dataType?: string;
    sourceColumns?: Column[]; // 血缘关系
}