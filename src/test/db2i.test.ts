import { format as originalFormat, FormatFn } from '../sqlFormatter';
import behavesLikeDb2Formatter from './behavesLikeDb2Formatter';
import supportsComments from './features/comments';

import supportsCreateTable from './features/createTable';
import supportsAlterTable from './features/alterTable';
import supportsDropTable from './features/dropTable';
import supportsJoin from './features/join';
import supportsOperators from './features/operators';
import supportsLimiting from './features/limiting';
import supportsDataTypeCase from './options/dataTypeCase';

describe('Db2iFormatter', () => {
  const language = 'db2i';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeDb2Formatter(format);

  supportsComments(format, { nestedBlockComments: true });
  supportsLimiting(format, { limit: true, fetchNext: true, fetchFirst: true, offset: true });
  supportsCreateTable(format, { orReplace: true });
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
  });
  supportsDropTable(format, { ifExists: true });
  supportsJoin(format, {
    without: ['NATURAL'],
    additionally: ['EXCEPTION JOIN', 'LEFT EXCEPTION JOIN', 'RIGHT EXCEPTION JOIN'],
  });
  supportsOperators(format, ['**', '¬=', '¬>', '¬<', '!>', '!<', '||', '=>'], { any: true });
  supportsDataTypeCase(format);
});
