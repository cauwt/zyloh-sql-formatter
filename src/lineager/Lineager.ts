import { Dialect } from '../dialect';
import { createParser } from '../parser/createParser';
import {
  AllColumnsAsteriskNode,
  ArraySubscriptNode,
  AstNode,
  BetweenPredicateNode,
  SetOperationNode,
  ClauseNode,
  FunctionCallNode,
  LimitClauseNode,
  NodeType,
  ParenthesisNode,
  LiteralNode,
  IdentifierNode,
  ParameterNode,
  OperatorNode,
  LineCommentNode,
  BlockCommentNode,
  CommaNode,
  KeywordNode,
  PropertyAccessNode,
  CommentNode,
  CaseExpressionNode,
  CaseWhenNode,
  CaseElseNode,
  DataTypeNode,
  ParameterizedDataTypeNode,
  DisableCommentNode,
  StatementNode
} from '../parser/ast';
import { LineageOptions} from '../sqlLineager';
import { ColumnLineage } from './columnLineage';
import { TableLineage } from './tableLineage';
import { Table } from './table';

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
   * @return { TableLineage[]} 血缘关系列表
   */
  public analyze(query: string): TableLineage[] {
    const ast = this.parse(query);
    return this.analyzeAst(ast);
  }

  private parse(query: string): StatementNode[] {
    return createParser(this.dialect.tokenizer).parse(query, {});
  }

  private analyzeAst(statements: StatementNode[]): TableLineage[] {
    const lineages: TableLineage[] = [];
    // 遍历每个语句节点
    for (const statement of statements) {
      if (statement.children.length > 0) {
        const subnode0 = statement.children[0];
        if (subnode0.type === NodeType.clause && subnode0.nameKw.text.match(/CREATE (GLOBAL TEMPORARY)? TABLE/iuy)) {
          // 提取表名
          const tableNameNode = subnode0.children[0];
          const tableName = this.extractIdentifier(tableNameNode);
          console.log('Extracted Table Name:', tableName);
          let tableLineage: TableLineage = {
            target_table: this.extractTableInfo(tableName),
            columnLineages: []
          };
          // 根据需要进一步处理血缘关系
          // 这里可以添加具体的血缘分析逻辑
          lineages.push(tableLineage);
        }
      }
    }
    return lineages;
  }
  // 提取标识符，类型可能有a.b形式，或者a形式
  private extractIdentifier(node: AstNode): String {
    if (node.type === NodeType.identifier) {
      return (node as IdentifierNode).text;
    } else if (node.type === NodeType.property_access) {
      const propertyAccessNode = node as PropertyAccessNode;
      return `${this.extractIdentifier(propertyAccessNode.object)}.${this.extractIdentifier(propertyAccessNode.property)}`;
    } else {
      return '';
    }
  }
  private extractTableInfo(tableName: String): Table {
    // 使用正则表达式匹配 [db.][schema.]table
    const match = tableName.match(/^(?:(?<db>\w+)\.)?(?:(?<schema>\w+)\.)?(?<name>\w+)$/);
  
    if (!match || !match.groups) {
      throw new Error(`Invalid table name format: ${tableName}`);
    }
  
    const { db, schema, name } = match.groups;
  
    return {
      db: db || undefined,
      schema: schema || undefined,
      name: name
    };
  }
} 