"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expandPhrases_js_1 = require("../../src/expandPhrases.js");
describe('expandSinglePhrase()', () => {
    it('returns single item when no [optional blocks] found', () => {
        expect((0, expandPhrases_js_1.expandSinglePhrase)('INSERT INTO')).toEqual(['INSERT INTO']);
    });
    it('expands expression with one [optional block] at the end', () => {
        expect((0, expandPhrases_js_1.expandSinglePhrase)('DROP TABLE [IF EXISTS]')).toEqual([
            'DROP TABLE',
            'DROP TABLE IF EXISTS',
        ]);
    });
    it('expands expression with one [optional block] at the middle', () => {
        expect((0, expandPhrases_js_1.expandSinglePhrase)('CREATE [TEMPORARY] TABLE')).toEqual([
            'CREATE TABLE',
            'CREATE TEMPORARY TABLE',
        ]);
    });
    it('expands expression with one [optional block] at the start', () => {
        expect((0, expandPhrases_js_1.expandSinglePhrase)('[EXPLAIN] SELECT')).toEqual(['SELECT', 'EXPLAIN SELECT']);
    });
    it('expands multiple [optional] [blocks]', () => {
        expect((0, expandPhrases_js_1.expandSinglePhrase)('CREATE [OR REPLACE] [MATERIALIZED] VIEW')).toEqual([
            'CREATE VIEW',
            'CREATE MATERIALIZED VIEW',
            'CREATE OR REPLACE VIEW',
            'CREATE OR REPLACE MATERIALIZED VIEW',
        ]);
    });
    it('expands expression with optional [multi|choice|block]', () => {
        expect((0, expandPhrases_js_1.expandSinglePhrase)('CREATE [TEMP|TEMPORARY|VIRTUAL] TABLE')).toEqual([
            'CREATE TABLE',
            'CREATE TEMP TABLE',
            'CREATE TEMPORARY TABLE',
            'CREATE VIRTUAL TABLE',
        ]);
    });
    it('removes braces around {mandatory} {block}', () => {
        expect((0, expandPhrases_js_1.expandSinglePhrase)('CREATE {TEMP} {TABLE}')).toEqual(['CREATE TEMP TABLE']);
    });
    it('expands expression with mandatory {multi|choice|block}', () => {
        expect((0, expandPhrases_js_1.expandSinglePhrase)('CREATE {TEMP|TEMPORARY|VIRTUAL} TABLE')).toEqual([
            'CREATE TEMP TABLE',
            'CREATE TEMPORARY TABLE',
            'CREATE VIRTUAL TABLE',
        ]);
    });
    it('expands nested []-block inside []-block', () => {
        expect((0, expandPhrases_js_1.expandSinglePhrase)('CREATE [[OR] REPLACE] TABLE')).toEqual([
            'CREATE TABLE',
            'CREATE REPLACE TABLE',
            'CREATE OR REPLACE TABLE',
        ]);
    });
    it('expands nested {}-block inside {}-block', () => {
        expect((0, expandPhrases_js_1.expandSinglePhrase)('CREATE {{OR} REPLACE} TABLE')).toEqual(['CREATE OR REPLACE TABLE']);
    });
    it('expands nested {}-block inside []-block', () => {
        expect((0, expandPhrases_js_1.expandSinglePhrase)('FOR RS [USE AND KEEP {UPDATE | EXCLUSIVE} LOCKS]')).toEqual([
            'FOR RS',
            'FOR RS USE AND KEEP UPDATE LOCKS',
            'FOR RS USE AND KEEP EXCLUSIVE LOCKS',
        ]);
    });
    it('throws error when encountering unbalanced ][-braces', () => {
        expect(() => (0, expandPhrases_js_1.expandSinglePhrase)('CREATE [TABLE')).toThrowErrorMatchingInlineSnapshot(`"Unbalanced parenthesis in: CREATE [TABLE"`);
        expect(() => (0, expandPhrases_js_1.expandSinglePhrase)('CREATE TABLE]')).toThrowErrorMatchingInlineSnapshot(`"Unbalanced parenthesis in: CREATE TABLE]"`);
    });
    it('throws error when encountering unbalanced }{-braces', () => {
        expect(() => (0, expandPhrases_js_1.expandSinglePhrase)('CREATE {TABLE')).toThrowErrorMatchingInlineSnapshot(`"Unbalanced parenthesis in: CREATE {TABLE"`);
        expect(() => (0, expandPhrases_js_1.expandSinglePhrase)('CREATE TABLE}')).toThrowErrorMatchingInlineSnapshot(`"Unbalanced parenthesis in: CREATE TABLE}"`);
    });
});
//# sourceMappingURL=expandPhrases.test.js.map