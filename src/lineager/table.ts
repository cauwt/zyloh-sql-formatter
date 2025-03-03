export interface Column {
    name: String;
    type: String;

}

export interface Table {
    db?: String;                             // 数据库名称
    schema?: String;                         // 模式名称
    name: String;                           // 目标表
    columns?: Column[];                      // 字段列表
  }
