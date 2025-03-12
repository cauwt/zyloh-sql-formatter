"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Indentation_js_1 = __importDefault(require("../../src/formatter/Indentation.js"));
const Layout_js_1 = __importStar(require("../../src/formatter/Layout.js"));
describe('Layout', () => {
    function testLayout(...items) {
        // an Indentation object with two steps of indentation
        const indentation = new Indentation_js_1.default('-->');
        indentation.increaseTopLevel();
        indentation.increaseTopLevel();
        const layout = new Layout_js_1.default(indentation);
        layout.add(...items);
        return layout.toString();
    }
    it('simply concatenates plain strings', () => {
        expect(testLayout('hello', 'world')).toBe('helloworld');
    });
    describe('WS.SPACE', () => {
        it('inserts single space', () => {
            expect(testLayout('hello', Layout_js_1.WS.SPACE, 'world')).toBe('hello world');
        });
    });
    describe('WS.SINGLE_INDENT', () => {
        it('inserts single indentation step', () => {
            expect(testLayout('hello', Layout_js_1.WS.NEWLINE, Layout_js_1.WS.SINGLE_INDENT, 'world')).toBe('hello\n-->world');
        });
        it('inserts two indentation steps when used twice', () => {
            expect(testLayout('hello', Layout_js_1.WS.NEWLINE, Layout_js_1.WS.SINGLE_INDENT, Layout_js_1.WS.SINGLE_INDENT, 'world')).toBe('hello\n-->-->world');
        });
    });
    describe('WS.INDENT', () => {
        it('inserts current amount of indentation', () => {
            expect(testLayout('hello', Layout_js_1.WS.NEWLINE, Layout_js_1.WS.INDENT, 'world')).toBe('hello\n-->-->world');
        });
        it('inserts double the current indentation when used twice', () => {
            expect(testLayout('hello', Layout_js_1.WS.NEWLINE, Layout_js_1.WS.INDENT, Layout_js_1.WS.INDENT, 'world')).toBe('hello\n-->-->-->-->world');
        });
    });
    describe('WS.NO_SPACE', () => {
        it('does nothing when no preceding whitespace', () => {
            expect(testLayout('hello', Layout_js_1.WS.NO_SPACE, 'world')).toBe('helloworld');
        });
        it('removes all preceding spaces', () => {
            expect(testLayout('hello', Layout_js_1.WS.SPACE, Layout_js_1.WS.SPACE, Layout_js_1.WS.NO_SPACE, 'world')).toBe('helloworld');
        });
        it('removes all preceding indentation', () => {
            expect(testLayout('hello', Layout_js_1.WS.NEWLINE, Layout_js_1.WS.SINGLE_INDENT, Layout_js_1.WS.SINGLE_INDENT, Layout_js_1.WS.NO_SPACE, 'world')).toBe('hello\nworld');
            expect(testLayout('hello', Layout_js_1.WS.NEWLINE, Layout_js_1.WS.INDENT, Layout_js_1.WS.NO_SPACE, 'world')).toBe('hello\nworld');
        });
        it('does not remove preceding newline', () => {
            expect(testLayout('hello', Layout_js_1.WS.NEWLINE, Layout_js_1.WS.NO_SPACE, 'world')).toBe('hello\nworld');
            expect(testLayout('hello', Layout_js_1.WS.MANDATORY_NEWLINE, Layout_js_1.WS.NO_SPACE, 'world')).toBe('hello\nworld');
        });
        it('removes preceding spaces up to first newline', () => {
            expect(testLayout('hello', Layout_js_1.WS.NEWLINE, Layout_js_1.WS.SPACE, Layout_js_1.WS.NO_SPACE, 'world')).toBe('hello\nworld');
            expect(testLayout('hello', Layout_js_1.WS.MANDATORY_NEWLINE, Layout_js_1.WS.SPACE, Layout_js_1.WS.NO_SPACE, 'world')).toBe('hello\nworld');
        });
    });
    describe('WS.NEWLINE', () => {
        it('inserts single newline', () => {
            expect(testLayout('hello', Layout_js_1.WS.NEWLINE, 'world')).toBe('hello\nworld');
        });
        it('inserts single newline, even when used twice', () => {
            expect(testLayout('hello', Layout_js_1.WS.NEWLINE, Layout_js_1.WS.NEWLINE, 'world')).toBe('hello\nworld');
        });
        it('trims preceding horizontal whitespace', () => {
            expect(testLayout('hello', Layout_js_1.WS.SPACE, Layout_js_1.WS.NEWLINE, 'world')).toBe('hello\nworld');
            expect(testLayout('hello', Layout_js_1.WS.INDENT, Layout_js_1.WS.NEWLINE, 'world')).toBe('hello\nworld');
            expect(testLayout('hello', Layout_js_1.WS.SINGLE_INDENT, Layout_js_1.WS.NEWLINE, 'world')).toBe('hello\nworld');
        });
    });
    describe('WS.MANDATORY_NEWLINE', () => {
        it('inserts single newline', () => {
            expect(testLayout('hello', Layout_js_1.WS.MANDATORY_NEWLINE, 'world')).toBe('hello\nworld');
        });
        it('inserts single newline, even when used twice', () => {
            expect(testLayout('hello', Layout_js_1.WS.MANDATORY_NEWLINE, Layout_js_1.WS.MANDATORY_NEWLINE, 'world')).toBe('hello\nworld');
        });
        it('inserts single newline, even when used after plain WS.NEWLINE', () => {
            expect(testLayout('hello', Layout_js_1.WS.NEWLINE, Layout_js_1.WS.MANDATORY_NEWLINE, 'world')).toBe('hello\nworld');
        });
        it('inserts single newline, even when used before plain WS.NEWLINE', () => {
            expect(testLayout('hello', Layout_js_1.WS.NEWLINE, Layout_js_1.WS.MANDATORY_NEWLINE, 'world')).toBe('hello\nworld');
        });
    });
    describe('WS.NO_NEWLINE', () => {
        it('removes all preceding spaces', () => {
            expect(testLayout('hello', Layout_js_1.WS.SPACE, Layout_js_1.WS.NO_NEWLINE, 'world')).toBe('helloworld');
        });
        it('removes all preceding newlines', () => {
            expect(testLayout('hello', Layout_js_1.WS.NEWLINE, Layout_js_1.WS.NO_NEWLINE, 'world')).toBe('helloworld');
        });
        it('does not remove preceding mandatory newlines', () => {
            expect(testLayout('hello', Layout_js_1.WS.MANDATORY_NEWLINE, Layout_js_1.WS.NO_NEWLINE, 'world')).toBe('hello\nworld');
        });
    });
});
//# sourceMappingURL=Layout.test.js.map