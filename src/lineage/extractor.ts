import { createParser } from '../parser/createParser';
import { StatementNode } from '../parser/ast';
import { Dialect } from '../dialect';
import { LineageOptions } from 'src/sqlLineager';

export default class Extractor {
  private dialect: Dialect;
  private cfg: LineageOptions;

  constructor(dialect: Dialect, cfg: LineageOptions) {
    this.dialect = dialect;
    this.cfg = cfg;
  }

  public extract(sql: string): StatementNode[] {
    const ast = this.parse(sql);
    return ast;
  }

  private parse(sql: string): StatementNode[] {
    return createParser(this.dialect.tokenizer).parse(sql, {});
  }

}
