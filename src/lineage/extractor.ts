import { FormatOptions } from '../FormatOptions.js';

import { createParser } from '../parser/createParser.js';
import { StatementNode } from '../parser/ast.js';
import { Dialect } from '../dialect.js';

export default class Extractor {
  private dialect: Dialect;
  private cfg: FormatOptions;

    constructor(dialect: Dialect, cfg: FormatOptions) {
        this.dialect = dialect;
        this.cfg = cfg;
    }
    
    public extract(sql: string): StatementNode[] {
        const ast = this.parse(sql);
        return ast;
    }

    private parse(sql: string): StatementNode[] {
        return createParser(this.dialect.tokenizer).parse(sql, this.cfg.paramTypes || {});
      }
    
}
