"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tabularStyle_js_1 = __importDefault(require("../../src/formatter/tabularStyle.js"));
describe('toTabularFormat()', () => {
    it('does nothing in standard style', () => {
        expect((0, tabularStyle_js_1.default)('FROM', 'standard')).toBe('FROM');
        expect((0, tabularStyle_js_1.default)('INNER JOIN', 'standard')).toBe('INNER JOIN');
        expect((0, tabularStyle_js_1.default)('INSERT INTO', 'standard')).toBe('INSERT INTO');
    });
    it('formats in tabularLeft style', () => {
        expect((0, tabularStyle_js_1.default)('FROM', 'tabularLeft')).toBe('FROM     ');
        expect((0, tabularStyle_js_1.default)('INNER JOIN', 'tabularLeft')).toBe('INNER     JOIN');
        expect((0, tabularStyle_js_1.default)('INSERT INTO', 'tabularLeft')).toBe('INSERT    INTO');
    });
    it('formats in tabularRight style', () => {
        expect((0, tabularStyle_js_1.default)('FROM', 'tabularRight')).toBe('     FROM');
        expect((0, tabularStyle_js_1.default)('INNER JOIN', 'tabularRight')).toBe('    INNER JOIN');
        expect((0, tabularStyle_js_1.default)('INSERT INTO', 'tabularRight')).toBe('   INSERT INTO');
    });
});
//# sourceMappingURL=tabularStyle.test.js.map