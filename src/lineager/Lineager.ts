import { Dialect } from '../dialect.js';
import { createParser } from '../parser/createParser.js';
import { StatementNode, NodeType } from '../parser/ast.js';
import { LineageOptions, ColumnLineage } from '../sqlLineager.js';

export default class Lineager {
  private dialect: Dialect;
  private options: LineageOptions;

  constructor(dialect: Dialect, options: LineageOptions) {
    this.dialect = dialect;
    this.options = options;
  }

  /**
   * 分析SQL查询中的字段血缘关系
   * @param {string} query - SQL查询语句
   * @return {ColumnLineage[]} 血缘关系列表
   */
  public analyze(query: string): ColumnLineage[] {
    const ast = this.parse(query);
    return this.analyzeAst(ast);
  }

  private parse(query: string): StatementNode[] {
    return createParser(this.dialect.tokenizer).parse(query, {});
  }

  private analyzeAst(statements: StatementNode[]): ColumnLineage[] {
    const lineages: ColumnLineage[] = [];
    // 遍历每个语句节点
    for(const statement of statements){
      for (const child of statement.children) {
        console.log(child.type);
        if( child.type === NodeType.clause){
          console.log(child.nameKw);}
        }
      }
      // 判断语句类型
      // 1. CREATE TABLE 建表语句
      // 1. CREATE TABLE ... SELECT
      // 2. INSERT INTO ... SELECT
    // 遍历语法树，提取字段血缘关系
    // 这里需要实现具体的血缘分析逻辑
    // 1. 分析SELECT语句的目标字段
    // 2. 追踪字段来源（FROM、JOIN等子句）
    // 3. 处理子查询和CTE（如果启用）
    // 4. 处理字段转换和计算

    return lineages;
  }
} 