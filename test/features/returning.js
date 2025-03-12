"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = supportsReturning;
const dedent_js_1 = __importDefault(require("dedent-js"));
function supportsReturning(format) {
    it('places RETURNING to new line', () => {
        const result = format("INSERT INTO users (firstname, lastname) VALUES ('Joe', 'Cool') RETURNING id, firstname;");
        expect(result).toBe((0, dedent_js_1.default) `
      INSERT INTO
        users (firstname, lastname)
      VALUES
        ('Joe', 'Cool')
      RETURNING
        id,
        firstname;
    `);
    });
}
//# sourceMappingURL=returning.js.map