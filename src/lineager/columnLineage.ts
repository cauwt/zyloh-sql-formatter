// 定义血缘关系的返回结构
export interface ColumnLineage {
  target: string;           // 目标字段
  source: string[];         // 来源字段列表
  transformation?: string;  // 转换规则（如有）
}
