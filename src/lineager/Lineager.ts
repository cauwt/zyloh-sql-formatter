import { Dialect } from '../dialect.js';
import { createParser } from '../parser/createParser.js';
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
} from '../parser/ast.js';
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
    for (const statement of statements) {
      if (statement.children.length > 0) {
        const subnode0 = statement.children[0];
        if (subnode0.type === NodeType.clause && subnode0.nameKw.text === 'CREATE TABLE') {
          // 提取表名
          const tableNameNode = subnode0.children[0];
          const tableName = this.extractIdentifier(tableNameNode);
          console.log('Extracted Table Name:', tableName);
  
          // 根据需要进一步处理血缘关系
          // 这里可以添加具体的血缘分析逻辑
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
} 