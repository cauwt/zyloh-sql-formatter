"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsConstraints;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsConstraints(format, actions) {
    actions.forEach(action => {
        it(`treats ON UPDATE & ON DELETE ${action} as distinct keywords from ON`, () => {
            expect(format(`
        CREATE TABLE foo (
          update_time datetime ON UPDATE ${action},
          delete_time datetime ON DELETE ${action},
        );
      `)).toBe((0, dedent_js_1.default) `
        CREATE TABLE foo (
          update_time datetime ON UPDATE ${action},
          delete_time datetime ON DELETE ${action},
        );
      `);
        });
    });
}
//# sourceMappingURL=constraints.js.map