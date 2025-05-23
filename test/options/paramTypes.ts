import dedent from 'dedent-js';

import { FormatFn } from '../../src/sqlFormatter';

export default function supportsParamTypes(format: FormatFn) {
  describe('when paramTypes.positional=true', () => {
    it('replaces ? positional placeholders with param values', () => {
      const result = format('SELECT ?, ?, ?;', {
        paramTypes: { positional: true },
        params: ['first', 'second', 'third'],
      });
      expect(result).toBe(dedent`
        SELECT
          first,
          second,
          third;
      `);
    });
  });

  describe('when paramTypes.named=[":"]', () => {
    it('replaces :name named placeholders with param values', () => {
      const result = format('SELECT :a, :b, :c;', {
        paramTypes: { named: [':'] },
        params: { a: 'first', b: 'second', c: 'third' },
      });
      expect(result).toBe(dedent`
        SELECT
          first,
          second,
          third;
      `);
    });
  });

  describe('when paramTypes.numbered=[":"]', () => {
    it('replaces ?nr numbered placeholders with param values', () => {
      const result = format('SELECT ?1, ?2, ?3;', {
        paramTypes: { numbered: ['?'] },
        params: { 1: 'first', 2: 'second', 3: 'third' },
      });
      expect(result).toBe(dedent`
        SELECT
          first,
          second,
          third;
      `);
    });
  });

  // paramTypes.quoted
  //
  // There's no simple way to test that the paramTypes.quoted override works across all dialects
  // as it depends on the type of quotes used for identifiers in a particular dialect.
  // For now skipping this test as:
  //
  // - it likely works when the other paramTypes tests work
  // - it's the config that's least likely to be actually used in practice.

  describe('when paramTypes.custom=[...]', () => {
    it('replaces %blah% numbered placeholders with param values', () => {
      const result = format('SELECT %1%, %2%, %3%;', {
        paramTypes: { custom: [{ regex: '%[0-9]+%' }] },
        params: { '%1%': 'first', '%2%': 'second', '%3%': 'third' },
      });
      expect(result).toBe(dedent`
        SELECT
          first,
          second,
          third;
      `);
    });

    it('supports custom function for extracting parameter name', () => {
      const result = format('SELECT %1%, %2%, %3%;', {
        paramTypes: { custom: [{ regex: '%[0-9]+%', key: v => v.slice(1, -1) }] },
        params: { '1': 'first', '2': 'second', '3': 'third' },
      });
      expect(result).toBe(dedent`
        SELECT
          first,
          second,
          third;
      `);
    });

    it('supports multiple custom param types', () => {
      const result = format('SELECT %1%, {2};', {
        paramTypes: { custom: [{ regex: '%[0-9]+%' }, { regex: String.raw`\{[0-9]\}` }] },
        params: { '%1%': 'first', '{2}': 'second' },
      });
      expect(result).toBe(dedent`
        SELECT
          first,
          second;
      `);
    });

    // Normal SQL prepared statement parameters cannot really occur like this,
    // but we support this to facilitate using the paramTypes config for
    // working around SQL templating.
    it('supports parameterizing schema.table.column syntax', () => {
      const result = format('SELECT {schema}.{table}.{column} FROM {schema}.{table}', {
        paramTypes: { custom: [{ regex: String.raw`\{\w+\}` }] },
      });
      expect(result).toBe(dedent`
        SELECT
          {schema}.{table}.{column}
        FROM
          {schema}.{table}
      `);
    });

    it('does not enter infinite loop when empty regex given', () => {
      expect(() =>
        format('SELECT foo FROM bar', {
          paramTypes: { custom: [{ regex: '' }] },
        })
      ).toThrow(
        'Empty regex given in custom paramTypes. That would result in matching infinite amount of parameters.'
      );
    });
  });
}
