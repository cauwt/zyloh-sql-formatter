"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsCreateTable;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsCreateTable(format, cfg = {}) {
    it('formats short CREATE TABLE', () => {
        expect(format('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT);')).toBe((0, dedent_js_1.default) `
      CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT);
    `);
    });
    // The decision to place it to multiple lines is made based on the length of text inside braces
    // ignoring the whitespace. (Which is not quite right :P)
    it('formats long CREATE TABLE', () => {
        expect(format('CREATE TABLE tbl (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, doggie INT NOT NULL);')).toBe((0, dedent_js_1.default) `
      CREATE TABLE tbl (
        a INT PRIMARY KEY,
        b TEXT,
        c INT NOT NULL,
        doggie INT NOT NULL
      );
    `);
    });
    if (cfg.orReplace) {
        it('formats short CREATE OR REPLACE TABLE', () => {
            expect(format('CREATE OR REPLACE TABLE tbl (a INT PRIMARY KEY, b TEXT);')).toBe((0, dedent_js_1.default) `
        CREATE OR REPLACE TABLE tbl (a INT PRIMARY KEY, b TEXT);
      `);
        });
    }
    if (cfg.ifNotExists) {
        it('formats short CREATE TABLE IF NOT EXISTS', () => {
            expect(format('CREATE TABLE IF NOT EXISTS tbl (a INT PRIMARY KEY, b TEXT);')).toBe((0, dedent_js_1.default) `
        CREATE TABLE IF NOT EXISTS tbl (a INT PRIMARY KEY, b TEXT);
      `);
        });
    }
    if (cfg.columnComment) {
        it('formats short CREATE TABLE with column comments', () => {
            expect(format(`CREATE TABLE tbl (a INT COMMENT 'Hello world!', b TEXT COMMENT 'Here we are!');`)).toBe((0, dedent_js_1.default) `
        CREATE TABLE tbl (
          a INT COMMENT 'Hello world!',
          b TEXT COMMENT 'Here we are!'
        );
      `);
        });
    }
    if (cfg.tableComment) {
        it('formats short CREATE TABLE with comment', () => {
            expect(format(`CREATE TABLE tbl (a INT, b TEXT) COMMENT = 'Hello, world!';`)).toBe((0, dedent_js_1.default) `
        CREATE TABLE tbl (a INT, b TEXT) COMMENT = 'Hello, world!';
      `);
        });
    }
    it('correctly indents CREATE TABLE in tabular style', () => {
        expect(format(`CREATE TABLE foo (
          id INT PRIMARY KEY NOT NULL,
          fname VARCHAR NOT NULL
        );`, { indentStyle: 'tabularLeft' })).toBe((0, dedent_js_1.default) `
      CREATE    TABLE foo (
                id INT PRIMARY KEY NOT NULL,
                fname VARCHAR NOT NULL
                );
    `);
    });
}
//# sourceMappingURL=createTable.js.map