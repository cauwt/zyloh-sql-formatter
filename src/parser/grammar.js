"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d) { return d[0]; }
var LexerAdapter_js_1 = require("./LexerAdapter.js");
var ast_js_1 = require("./ast.js");
var token_js_1 = require("../lexer/token.js");
// The lexer here is only to provide the has() method,
// that's used inside the generated grammar definition.
// A proper lexer gets passed to Nearley Parser constructor.
var lexer = new LexerAdapter_js_1.default(function (chunk) { return []; });
// Used for unwrapping grammar rules like:
//
//   rule -> ( foo | bar | baz )
//
// which otherwise produce single element nested inside two arrays
var unwrap = function (_a) {
    var el = _a[0][0];
    return el;
};
var toKeywordNode = function (token) { return ({
    type: ast_js_1.NodeType.keyword,
    start: token.start,
    tokenType: token.type,
    text: token.text,
    raw: token.raw,
}); };
var toDataTypeNode = function (token) { return ({
    type: ast_js_1.NodeType.data_type,
    start: token.start,
    text: token.text,
    raw: token.raw,
}); };
var addComments = function (node, _a) {
    var leading = _a.leading, trailing = _a.trailing;
    if (leading === null || leading === void 0 ? void 0 : leading.length) {
        node = __assign(__assign({}, node), { leadingComments: leading });
    }
    if (trailing === null || trailing === void 0 ? void 0 : trailing.length) {
        node = __assign(__assign({}, node), { trailingComments: trailing });
    }
    return node;
};
var addCommentsToArray = function (nodes, _a) {
    var leading = _a.leading, trailing = _a.trailing;
    if (leading === null || leading === void 0 ? void 0 : leading.length) {
        var first = nodes[0], rest = nodes.slice(1);
        nodes = __spreadArray([addComments(first, { leading: leading })], rest, true);
    }
    if (trailing === null || trailing === void 0 ? void 0 : trailing.length) {
        var lead = nodes.slice(0, -1);
        var last = nodes[nodes.length - 1];
        nodes = __spreadArray(__spreadArray([], lead, true), [addComments(last, { trailing: trailing })], false);
    }
    return nodes;
};
;
;
;
;
var grammar = {
    Lexer: lexer,
    ParserRules: [
        { "name": "main$ebnf$1", "symbols": [] },
        { "name": "main$ebnf$1", "symbols": ["main$ebnf$1", "statement"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "main", "symbols": ["main$ebnf$1"], "postprocess": function (_a) {
                var statements = _a[0];
                var last = statements[statements.length - 1];
                if (last && !last.hasSemicolon) {
                    // we have fully parsed the whole file
                    // discard the last statement when it's empty
                    return last.children.length > 0 ? statements : statements.slice(0, -1);
                }
                else {
                    // parsing still in progress, do nothing
                    return statements;
                }
            }
        },
        { "name": "statement$subexpression$1", "symbols": [(lexer.has("DELIMITER") ? { type: "DELIMITER" } : DELIMITER)] },
        { "name": "statement$subexpression$1", "symbols": [(lexer.has("EOF") ? { type: "EOF" } : EOF)] },
        { "name": "statement", "symbols": ["expressions_or_clauses", "statement$subexpression$1"], "postprocess": function (_a) {
                var children = _a[0], delimiter = _a[1][0];
                return ({
                    type: ast_js_1.NodeType.statement,
                    start: children[0].start,
                    children: children,
                    hasSemicolon: delimiter.type === token_js_1.TokenType.DELIMITER,
                });
            }
        },
        { "name": "expressions_or_clauses$ebnf$1", "symbols": [] },
        { "name": "expressions_or_clauses$ebnf$1", "symbols": ["expressions_or_clauses$ebnf$1", "free_form_sql"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "expressions_or_clauses$ebnf$2", "symbols": [] },
        { "name": "expressions_or_clauses$ebnf$2", "symbols": ["expressions_or_clauses$ebnf$2", "clause"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "expressions_or_clauses", "symbols": ["expressions_or_clauses$ebnf$1", "expressions_or_clauses$ebnf$2"], "postprocess": function (_a) {
                var expressions = _a[0], clauses = _a[1];
                return __spreadArray(__spreadArray([], expressions, true), clauses, true);
            }
        },
        { "name": "clause$subexpression$1", "symbols": ["limit_clause"] },
        { "name": "clause$subexpression$1", "symbols": ["select_clause"] },
        { "name": "clause$subexpression$1", "symbols": ["other_clause"] },
        { "name": "clause$subexpression$1", "symbols": ["set_operation"] },
        { "name": "clause", "symbols": ["clause$subexpression$1"], "postprocess": unwrap },
        { "name": "limit_clause$ebnf$1$subexpression$1$ebnf$1", "symbols": ["free_form_sql"] },
        { "name": "limit_clause$ebnf$1$subexpression$1$ebnf$1", "symbols": ["limit_clause$ebnf$1$subexpression$1$ebnf$1", "free_form_sql"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "limit_clause$ebnf$1$subexpression$1", "symbols": [(lexer.has("COMMA") ? { type: "COMMA" } : COMMA), "limit_clause$ebnf$1$subexpression$1$ebnf$1"] },
        { "name": "limit_clause$ebnf$1", "symbols": ["limit_clause$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "limit_clause$ebnf$1", "symbols": [], "postprocess": function () { return null; } },
        { "name": "limit_clause", "symbols": [(lexer.has("LIMIT") ? { type: "LIMIT" } : LIMIT), "_", "expression_chain_", "limit_clause$ebnf$1"], "postprocess": function (_a) {
                var limitToken = _a[0], _ = _a[1], exp1 = _a[2], optional = _a[3];
                if (optional) {
                    var comma = optional[0], exp2 = optional[1];
                    return {
                        type: ast_js_1.NodeType.limit_clause,
                        start: limitToken.start,
                        limitKw: addComments(toKeywordNode(limitToken), { trailing: _ }),
                        offset: exp1,
                        count: exp2,
                    };
                }
                else {
                    return {
                        type: ast_js_1.NodeType.limit_clause,
                        start: limitToken.start,
                        limitKw: addComments(toKeywordNode(limitToken), { trailing: _ }),
                        count: exp1,
                    };
                }
            }
        },
        { "name": "select_clause$subexpression$1$ebnf$1", "symbols": [] },
        { "name": "select_clause$subexpression$1$ebnf$1", "symbols": ["select_clause$subexpression$1$ebnf$1", "free_form_sql"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "select_clause$subexpression$1", "symbols": ["all_columns_asterisk", "select_clause$subexpression$1$ebnf$1"] },
        { "name": "select_clause$subexpression$1$ebnf$2", "symbols": [] },
        { "name": "select_clause$subexpression$1$ebnf$2", "symbols": ["select_clause$subexpression$1$ebnf$2", "free_form_sql"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "select_clause$subexpression$1", "symbols": ["asteriskless_free_form_sql", "select_clause$subexpression$1$ebnf$2"] },
        { "name": "select_clause", "symbols": [(lexer.has("RESERVED_SELECT") ? { type: "RESERVED_SELECT" } : RESERVED_SELECT), "select_clause$subexpression$1"], "postprocess": function (_a) {
                var nameToken = _a[0], _b = _a[1], exp = _b[0], expressions = _b[1];
                return ({
                    type: ast_js_1.NodeType.clause,
                    start: nameToken.start,
                    nameKw: toKeywordNode(nameToken),
                    children: __spreadArray([exp], expressions, true),
                });
            }
        },
        { "name": "select_clause", "symbols": [(lexer.has("RESERVED_SELECT") ? { type: "RESERVED_SELECT" } : RESERVED_SELECT)], "postprocess": function (_a) {
                var nameToken = _a[0];
                return ({
                    type: ast_js_1.NodeType.clause,
                    start: nameToken.start,
                    nameKw: toKeywordNode(nameToken),
                    children: [],
                });
            }
        },
        { "name": "all_columns_asterisk", "symbols": [(lexer.has("ASTERISK") ? { type: "ASTERISK" } : ASTERISK)], "postprocess": function (_a) {
                var token = _a[0][0];
                return ({ type: ast_js_1.NodeType.all_columns_asterisk, start: token.start });
            }
        },
        { "name": "other_clause$ebnf$1", "symbols": [] },
        { "name": "other_clause$ebnf$1", "symbols": ["other_clause$ebnf$1", "free_form_sql"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "other_clause", "symbols": [(lexer.has("RESERVED_CLAUSE") ? { type: "RESERVED_CLAUSE" } : RESERVED_CLAUSE), "other_clause$ebnf$1"], "postprocess": function (_a) {
                var nameToken = _a[0], children = _a[1];
                return ({
                    type: ast_js_1.NodeType.clause,
                    start: nameToken.start,
                    nameKw: toKeywordNode(nameToken),
                    children: children,
                });
            }
        },
        { "name": "set_operation$ebnf$1", "symbols": [] },
        { "name": "set_operation$ebnf$1", "symbols": ["set_operation$ebnf$1", "free_form_sql"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "set_operation", "symbols": [(lexer.has("RESERVED_SET_OPERATION") ? { type: "RESERVED_SET_OPERATION" } : RESERVED_SET_OPERATION), "set_operation$ebnf$1"], "postprocess": function (_a) {
                var nameToken = _a[0], children = _a[1];
                return ({
                    type: ast_js_1.NodeType.set_operation,
                    start: nameToken.start,
                    nameKw: toKeywordNode(nameToken),
                    children: children,
                });
            }
        },
        { "name": "expression_chain_$ebnf$1", "symbols": ["expression_with_comments_"] },
        { "name": "expression_chain_$ebnf$1", "symbols": ["expression_chain_$ebnf$1", "expression_with_comments_"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "expression_chain_", "symbols": ["expression_chain_$ebnf$1"], "postprocess": id },
        { "name": "expression_chain$ebnf$1", "symbols": [] },
        { "name": "expression_chain$ebnf$1", "symbols": ["expression_chain$ebnf$1", "_expression_with_comments"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "expression_chain", "symbols": ["expression", "expression_chain$ebnf$1"], "postprocess": function (_a) {
                var expr = _a[0], chain = _a[1];
                return __spreadArray([expr], chain, true);
            }
        },
        { "name": "andless_expression_chain$ebnf$1", "symbols": [] },
        { "name": "andless_expression_chain$ebnf$1", "symbols": ["andless_expression_chain$ebnf$1", "_andless_expression_with_comments"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "andless_expression_chain", "symbols": ["andless_expression", "andless_expression_chain$ebnf$1"], "postprocess": function (_a) {
                var expr = _a[0], chain = _a[1];
                return __spreadArray([expr], chain, true);
            }
        },
        { "name": "expression_with_comments_", "symbols": ["expression", "_"], "postprocess": function (_a) {
                var expr = _a[0], _ = _a[1];
                return addComments(expr, { trailing: _ });
            }
        },
        { "name": "_expression_with_comments", "symbols": ["_", "expression"], "postprocess": function (_a) {
                var _ = _a[0], expr = _a[1];
                return addComments(expr, { leading: _ });
            }
        },
        { "name": "_andless_expression_with_comments", "symbols": ["_", "andless_expression"], "postprocess": function (_a) {
                var _ = _a[0], expr = _a[1];
                return addComments(expr, { leading: _ });
            }
        },
        { "name": "free_form_sql$subexpression$1", "symbols": ["asteriskless_free_form_sql"] },
        { "name": "free_form_sql$subexpression$1", "symbols": ["asterisk"] },
        { "name": "free_form_sql", "symbols": ["free_form_sql$subexpression$1"], "postprocess": unwrap },
        { "name": "asteriskless_free_form_sql$subexpression$1", "symbols": ["asteriskless_andless_expression"] },
        { "name": "asteriskless_free_form_sql$subexpression$1", "symbols": ["logic_operator"] },
        { "name": "asteriskless_free_form_sql$subexpression$1", "symbols": ["comma"] },
        { "name": "asteriskless_free_form_sql$subexpression$1", "symbols": ["comment"] },
        { "name": "asteriskless_free_form_sql$subexpression$1", "symbols": ["other_keyword"] },
        { "name": "asteriskless_free_form_sql", "symbols": ["asteriskless_free_form_sql$subexpression$1"], "postprocess": unwrap },
        { "name": "expression$subexpression$1", "symbols": ["andless_expression"] },
        { "name": "expression$subexpression$1", "symbols": ["logic_operator"] },
        { "name": "expression", "symbols": ["expression$subexpression$1"], "postprocess": unwrap },
        { "name": "andless_expression$subexpression$1", "symbols": ["asteriskless_andless_expression"] },
        { "name": "andless_expression$subexpression$1", "symbols": ["asterisk"] },
        { "name": "andless_expression", "symbols": ["andless_expression$subexpression$1"], "postprocess": unwrap },
        { "name": "asteriskless_andless_expression$subexpression$1", "symbols": ["atomic_expression"] },
        { "name": "asteriskless_andless_expression$subexpression$1", "symbols": ["between_predicate"] },
        { "name": "asteriskless_andless_expression$subexpression$1", "symbols": ["case_expression"] },
        { "name": "asteriskless_andless_expression", "symbols": ["asteriskless_andless_expression$subexpression$1"], "postprocess": unwrap },
        { "name": "atomic_expression$subexpression$1", "symbols": ["array_subscript"] },
        { "name": "atomic_expression$subexpression$1", "symbols": ["function_call"] },
        { "name": "atomic_expression$subexpression$1", "symbols": ["property_access"] },
        { "name": "atomic_expression$subexpression$1", "symbols": ["parenthesis"] },
        { "name": "atomic_expression$subexpression$1", "symbols": ["curly_braces"] },
        { "name": "atomic_expression$subexpression$1", "symbols": ["square_brackets"] },
        { "name": "atomic_expression$subexpression$1", "symbols": ["operator"] },
        { "name": "atomic_expression$subexpression$1", "symbols": ["identifier"] },
        { "name": "atomic_expression$subexpression$1", "symbols": ["parameter"] },
        { "name": "atomic_expression$subexpression$1", "symbols": ["literal"] },
        { "name": "atomic_expression$subexpression$1", "symbols": ["data_type"] },
        { "name": "atomic_expression$subexpression$1", "symbols": ["keyword"] },
        { "name": "atomic_expression", "symbols": ["atomic_expression$subexpression$1"], "postprocess": unwrap },
        { "name": "array_subscript", "symbols": [(lexer.has("ARRAY_IDENTIFIER") ? { type: "ARRAY_IDENTIFIER" } : ARRAY_IDENTIFIER), "_", "square_brackets"], "postprocess": function (_a) {
                var arrayToken = _a[0], _ = _a[1], brackets = _a[2];
                return ({
                    type: ast_js_1.NodeType.array_subscript,
                    start: arrayToken.start,
                    array: addComments({ type: ast_js_1.NodeType.identifier, quoted: false, text: arrayToken.text }, { trailing: _ }),
                    parenthesis: brackets,
                });
            }
        },
        { "name": "array_subscript", "symbols": [(lexer.has("ARRAY_KEYWORD") ? { type: "ARRAY_KEYWORD" } : ARRAY_KEYWORD), "_", "square_brackets"], "postprocess": function (_a) {
                var arrayToken = _a[0], _ = _a[1], brackets = _a[2];
                return ({
                    type: ast_js_1.NodeType.array_subscript,
                    start: arrayToken.start,
                    array: addComments(toKeywordNode(arrayToken), { trailing: _ }),
                    parenthesis: brackets,
                });
            }
        },
        { "name": "function_call", "symbols": [(lexer.has("RESERVED_FUNCTION_NAME") ? { type: "RESERVED_FUNCTION_NAME" } : RESERVED_FUNCTION_NAME), "_", "parenthesis"], "postprocess": function (_a) {
                var nameToken = _a[0], _ = _a[1], parens = _a[2];
                return ({
                    type: ast_js_1.NodeType.function_call,
                    start: nameToken.start,
                    nameKw: addComments(toKeywordNode(nameToken), { trailing: _ }),
                    parenthesis: parens,
                });
            }
        },
        { "name": "parenthesis", "symbols": [{ "literal": "(" }, "expressions_or_clauses", { "literal": ")" }], "postprocess": function (_a) {
                var open = _a[0], children = _a[1], close = _a[2];
                return ({
                    type: ast_js_1.NodeType.parenthesis,
                    start: open.start,
                    children: children,
                    openParen: "(",
                    closeParen: ")",
                });
            }
        },
        { "name": "curly_braces$ebnf$1", "symbols": [] },
        { "name": "curly_braces$ebnf$1", "symbols": ["curly_braces$ebnf$1", "free_form_sql"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "curly_braces", "symbols": [{ "literal": "{" }, "curly_braces$ebnf$1", { "literal": "}" }], "postprocess": function (_a) {
                var open = _a[0], children = _a[1], close = _a[2];
                return ({
                    type: ast_js_1.NodeType.parenthesis,
                    start: open.start,
                    children: children,
                    openParen: "{",
                    closeParen: "}",
                });
            }
        },
        { "name": "square_brackets$ebnf$1", "symbols": [] },
        { "name": "square_brackets$ebnf$1", "symbols": ["square_brackets$ebnf$1", "free_form_sql"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "square_brackets", "symbols": [{ "literal": "[" }, "square_brackets$ebnf$1", { "literal": "]" }], "postprocess": function (_a) {
                var open = _a[0], children = _a[1], close = _a[2];
                return ({
                    type: ast_js_1.NodeType.parenthesis,
                    start: open.start,
                    children: children,
                    openParen: "[",
                    closeParen: "]",
                });
            }
        },
        { "name": "property_access$subexpression$1", "symbols": ["identifier"] },
        { "name": "property_access$subexpression$1", "symbols": ["array_subscript"] },
        { "name": "property_access$subexpression$1", "symbols": ["all_columns_asterisk"] },
        { "name": "property_access$subexpression$1", "symbols": ["parameter"] },
        { "name": "property_access", "symbols": ["atomic_expression", "_", (lexer.has("PROPERTY_ACCESS_OPERATOR") ? { type: "PROPERTY_ACCESS_OPERATOR" } : PROPERTY_ACCESS_OPERATOR), "_", "property_access$subexpression$1"], "postprocess": 
            // Allowing property to be <array_subscript> is currently a hack.
            // A better way would be to allow <property_access> on the left side of array_subscript,
            // but we currently can't do that because of another hack that requires
            // %ARRAY_IDENTIFIER on the left side of <array_subscript>.
            function (_a) {
                var object = _a[0], _1 = _a[1], dot = _a[2], _2 = _a[3], property = _a[4][0];
                return {
                    type: ast_js_1.NodeType.property_access,
                    start: object.start,
                    object: addComments(object, { trailing: _1 }),
                    operator: dot.text,
                    property: addComments(property, { leading: _2 }),
                };
            }
        },
        { "name": "between_predicate", "symbols": [(lexer.has("BETWEEN") ? { type: "BETWEEN" } : BETWEEN), "_", "andless_expression_chain", "_", (lexer.has("AND") ? { type: "AND" } : AND), "_", "andless_expression"], "postprocess": function (_a) {
                var betweenToken = _a[0], _1 = _a[1], expr1 = _a[2], _2 = _a[3], andToken = _a[4], _3 = _a[5], expr2 = _a[6];
                return ({
                    type: ast_js_1.NodeType.between_predicate,
                    start: betweenToken.start,
                    betweenKw: toKeywordNode(betweenToken),
                    expr1: addCommentsToArray(expr1, { leading: _1, trailing: _2 }),
                    andKw: toKeywordNode(andToken),
                    expr2: [addComments(expr2, { leading: _3 })],
                });
            }
        },
        { "name": "case_expression$ebnf$1", "symbols": ["expression_chain_"], "postprocess": id },
        { "name": "case_expression$ebnf$1", "symbols": [], "postprocess": function () { return null; } },
        { "name": "case_expression$ebnf$2", "symbols": [] },
        { "name": "case_expression$ebnf$2", "symbols": ["case_expression$ebnf$2", "case_clause"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "case_expression", "symbols": [(lexer.has("CASE") ? { type: "CASE" } : CASE), "_", "case_expression$ebnf$1", "case_expression$ebnf$2", (lexer.has("END") ? { type: "END" } : END)], "postprocess": function (_a) {
                var caseToken = _a[0], _ = _a[1], expr = _a[2], clauses = _a[3], endToken = _a[4];
                return ({
                    type: ast_js_1.NodeType.case_expression,
                    start: caseToken.start,
                    caseKw: addComments(toKeywordNode(caseToken), { trailing: _ }),
                    endKw: toKeywordNode(endToken),
                    expr: expr || [],
                    clauses: clauses,
                });
            }
        },
        { "name": "case_clause", "symbols": [(lexer.has("WHEN") ? { type: "WHEN" } : WHEN), "_", "expression_chain_", (lexer.has("THEN") ? { type: "THEN" } : THEN), "_", "expression_chain_"], "postprocess": function (_a) {
                var whenToken = _a[0], _1 = _a[1], cond = _a[2], thenToken = _a[3], _2 = _a[4], expr = _a[5];
                return ({
                    type: ast_js_1.NodeType.case_when,
                    start: whenToken.start,
                    whenKw: addComments(toKeywordNode(whenToken), { trailing: _1 }),
                    thenKw: addComments(toKeywordNode(thenToken), { trailing: _2 }),
                    condition: cond,
                    result: expr,
                });
            }
        },
        { "name": "case_clause", "symbols": [(lexer.has("ELSE") ? { type: "ELSE" } : ELSE), "_", "expression_chain_"], "postprocess": function (_a) {
                var elseToken = _a[0], _ = _a[1], expr = _a[2];
                return ({
                    type: ast_js_1.NodeType.case_else,
                    start: elseToken.start,
                    elseKw: addComments(toKeywordNode(elseToken), { trailing: _ }),
                    result: expr,
                });
            }
        },
        { "name": "comma$subexpression$1", "symbols": [(lexer.has("COMMA") ? { type: "COMMA" } : COMMA)] },
        { "name": "comma", "symbols": ["comma$subexpression$1"], "postprocess": function (_a) {
                var token = _a[0][0];
                return ({ type: ast_js_1.NodeType.comma, start: token.start });
            } },
        { "name": "asterisk$subexpression$1", "symbols": [(lexer.has("ASTERISK") ? { type: "ASTERISK" } : ASTERISK)] },
        { "name": "asterisk", "symbols": ["asterisk$subexpression$1"], "postprocess": function (_a) {
                var token = _a[0][0];
                return ({ type: ast_js_1.NodeType.operator, text: token.text, start: token.start });
            } },
        { "name": "operator$subexpression$1", "symbols": [(lexer.has("OPERATOR") ? { type: "OPERATOR" } : OPERATOR)] },
        { "name": "operator", "symbols": ["operator$subexpression$1"], "postprocess": function (_a) {
                var token = _a[0][0];
                return ({ type: ast_js_1.NodeType.operator, text: token.text, start: token.start });
            } },
        { "name": "identifier$subexpression$1", "symbols": [(lexer.has("IDENTIFIER") ? { type: "IDENTIFIER" } : IDENTIFIER)] },
        { "name": "identifier$subexpression$1", "symbols": [(lexer.has("QUOTED_IDENTIFIER") ? { type: "QUOTED_IDENTIFIER" } : QUOTED_IDENTIFIER)] },
        { "name": "identifier$subexpression$1", "symbols": [(lexer.has("VARIABLE") ? { type: "VARIABLE" } : VARIABLE)] },
        { "name": "identifier", "symbols": ["identifier$subexpression$1"], "postprocess": function (_a) {
                var token = _a[0][0];
                return ({ type: ast_js_1.NodeType.identifier, quoted: token.type !== "IDENTIFIER", text: token.text, start: token.start });
            } },
        { "name": "parameter$subexpression$1", "symbols": [(lexer.has("NAMED_PARAMETER") ? { type: "NAMED_PARAMETER" } : NAMED_PARAMETER)] },
        { "name": "parameter$subexpression$1", "symbols": [(lexer.has("QUOTED_PARAMETER") ? { type: "QUOTED_PARAMETER" } : QUOTED_PARAMETER)] },
        { "name": "parameter$subexpression$1", "symbols": [(lexer.has("NUMBERED_PARAMETER") ? { type: "NUMBERED_PARAMETER" } : NUMBERED_PARAMETER)] },
        { "name": "parameter$subexpression$1", "symbols": [(lexer.has("POSITIONAL_PARAMETER") ? { type: "POSITIONAL_PARAMETER" } : POSITIONAL_PARAMETER)] },
        { "name": "parameter$subexpression$1", "symbols": [(lexer.has("CUSTOM_PARAMETER") ? { type: "CUSTOM_PARAMETER" } : CUSTOM_PARAMETER)] },
        { "name": "parameter", "symbols": ["parameter$subexpression$1"], "postprocess": function (_a) {
                var token = _a[0][0];
                return ({ type: ast_js_1.NodeType.parameter, key: token.key, text: token.text, start: token.start });
            } },
        { "name": "literal$subexpression$1", "symbols": [(lexer.has("NUMBER") ? { type: "NUMBER" } : NUMBER)] },
        { "name": "literal$subexpression$1", "symbols": [(lexer.has("STRING") ? { type: "STRING" } : STRING)] },
        { "name": "literal", "symbols": ["literal$subexpression$1"], "postprocess": function (_a) {
                var token = _a[0][0];
                return ({ type: ast_js_1.NodeType.literal, text: token.text, start: token.start });
            } },
        { "name": "keyword$subexpression$1", "symbols": [(lexer.has("RESERVED_KEYWORD") ? { type: "RESERVED_KEYWORD" } : RESERVED_KEYWORD)] },
        { "name": "keyword$subexpression$1", "symbols": [(lexer.has("RESERVED_PHRASE") ? { type: "RESERVED_PHRASE" } : RESERVED_PHRASE)] },
        { "name": "keyword$subexpression$1", "symbols": [(lexer.has("RESERVED_JOIN") ? { type: "RESERVED_JOIN" } : RESERVED_JOIN)] },
        { "name": "keyword", "symbols": ["keyword$subexpression$1"], "postprocess": function (_a) {
                var token = _a[0][0];
                return toKeywordNode(token);
            }
        },
        { "name": "data_type$subexpression$1", "symbols": [(lexer.has("RESERVED_DATA_TYPE") ? { type: "RESERVED_DATA_TYPE" } : RESERVED_DATA_TYPE)] },
        { "name": "data_type", "symbols": ["data_type$subexpression$1"], "postprocess": function (_a) {
                var token = _a[0][0];
                return toDataTypeNode(token);
            }
        },
        { "name": "data_type", "symbols": [(lexer.has("RESERVED_PARAMETERIZED_DATA_TYPE") ? { type: "RESERVED_PARAMETERIZED_DATA_TYPE" } : RESERVED_PARAMETERIZED_DATA_TYPE), "_", "parenthesis"], "postprocess": function (_a) {
                var nameToken = _a[0], _ = _a[1], parens = _a[2];
                return ({
                    type: ast_js_1.NodeType.parameterized_data_type,
                    start: nameToken.start,
                    dataType: addComments(toDataTypeNode(nameToken), { trailing: _ }),
                    parenthesis: parens,
                });
            }
        },
        { "name": "logic_operator$subexpression$1", "symbols": [(lexer.has("AND") ? { type: "AND" } : AND)] },
        { "name": "logic_operator$subexpression$1", "symbols": [(lexer.has("OR") ? { type: "OR" } : OR)] },
        { "name": "logic_operator$subexpression$1", "symbols": [(lexer.has("XOR") ? { type: "XOR" } : XOR)] },
        { "name": "logic_operator", "symbols": ["logic_operator$subexpression$1"], "postprocess": function (_a) {
                var token = _a[0][0];
                return toKeywordNode(token);
            }
        },
        { "name": "other_keyword$subexpression$1", "symbols": [(lexer.has("WHEN") ? { type: "WHEN" } : WHEN)] },
        { "name": "other_keyword$subexpression$1", "symbols": [(lexer.has("THEN") ? { type: "THEN" } : THEN)] },
        { "name": "other_keyword$subexpression$1", "symbols": [(lexer.has("ELSE") ? { type: "ELSE" } : ELSE)] },
        { "name": "other_keyword$subexpression$1", "symbols": [(lexer.has("END") ? { type: "END" } : END)] },
        { "name": "other_keyword", "symbols": ["other_keyword$subexpression$1"], "postprocess": function (_a) {
                var token = _a[0][0];
                return toKeywordNode(token);
            }
        },
        { "name": "_$ebnf$1", "symbols": [] },
        { "name": "_$ebnf$1", "symbols": ["_$ebnf$1", "comment"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
        { "name": "_", "symbols": ["_$ebnf$1"], "postprocess": function (_a) {
                var comments = _a[0];
                return comments;
            } },
        { "name": "comment", "symbols": [(lexer.has("LINE_COMMENT") ? { type: "LINE_COMMENT" } : LINE_COMMENT)], "postprocess": function (_a) {
                var token = _a[0];
                return ({
                    type: ast_js_1.NodeType.line_comment,
                    start: token.start,
                    text: token.text,
                    precedingWhitespace: token.precedingWhitespace,
                });
            }
        },
        { "name": "comment", "symbols": [(lexer.has("BLOCK_COMMENT") ? { type: "BLOCK_COMMENT" } : BLOCK_COMMENT)], "postprocess": function (_a) {
                var token = _a[0];
                return ({
                    type: ast_js_1.NodeType.block_comment,
                    start: token.start,
                    text: token.text,
                    precedingWhitespace: token.precedingWhitespace,
                });
            }
        },
        { "name": "comment", "symbols": [(lexer.has("DISABLE_COMMENT") ? { type: "DISABLE_COMMENT" } : DISABLE_COMMENT)], "postprocess": function (_a) {
                var token = _a[0];
                return ({
                    type: ast_js_1.NodeType.disable_comment,
                    start: token.start,
                    text: token.text,
                    precedingWhitespace: token.precedingWhitespace,
                });
            }
        }
    ],
    ParserStart: "main",
};
exports.default = grammar;
