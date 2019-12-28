// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

	const moo = require('moo')

	let lexer = moo.compile({
		WS:         /[ \t]+/,
		comment:    /\/\/.*?$/,
		commentblock: /\/\*(?:\*(?!\/)|[^*])*\*\//,
		number:     /0|[1-9][0-9]*/,
		string:     { match: /"(?:\\["\\]|[^\n"\\])*"/, value: x => x.slice(1, -1) },
		itemtype:   ['Group', 'Number', 'Switch', 'Rollershutter', 'String', 'Dimmer', 'Contact', 'DateTime', 'Color', 'Player', 'Location', 'Call', 'Image'],
		identifier: /[A-Za-z0-9_-]+/,
		lparen:  	'(',
		rparen:  	')',
		colon:   	':',
		lbrace: 	'{',
		rbrace: 	'}',
		lbracket: 	'[',
		rbracket: 	']',
		lt: 		'<',
		gt: 		'>',
		comma: 		',',
		equals: 	'=',
		NL:      	{ match: /\n/, lineBreaks: true },
	})
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "Main", "symbols": ["_", "Items", "_"], "postprocess": (d) => d[1]},
    {"name": "Items", "symbols": ["Item"], "postprocess": (d) => [d[0]]},
    {"name": "Items", "symbols": ["Items", "_", "Item"], "postprocess": (d) => d[0].concat([d[2]])},
    {"name": "Item", "symbols": ["Type", "__", "Name", "Label", "Icon", "Groups", "Tags", "Metadata"], "postprocess":  function (d) {
        	return {
        		type: d[0][0],
        		groupType: d[0][1],
        		function: d[0][2],
        		name: d[2],
        		label: d[3],
        		category: d[4],
        		groupNames: d[5],
        		tags: d[6],
        		metadata: d[7] // metadata (and bindings/links) are not part of the API model and should be processed separately
        	}
        } },
    {"name": "Type", "symbols": [(lexer.has("itemtype") ? {type: "itemtype"} : itemtype)], "postprocess": (d) => [d[0].text]},
    {"name": "Type", "symbols": [{"literal":"Number"}, {"literal":":"}, (lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => ['Number:' + d[2].text]},
    {"name": "Type", "symbols": [{"literal":"Group"}, {"literal":":"}, (lexer.has("itemtype") ? {type: "itemtype"} : itemtype)], "postprocess": (d) => ['Group', d[2].text]},
    {"name": "Type", "symbols": [{"literal":"Group"}, {"literal":":"}, (lexer.has("itemtype") ? {type: "itemtype"} : itemtype), {"literal":":"}, (lexer.has("identifier") ? {type: "identifier"} : identifier), "AggArgs"], "postprocess": (d) => ['Group', d[2].text, {name: d[4].text, args: d[5]}]},
    {"name": "AggArgs", "symbols": [], "postprocess": (d) => undefined},
    {"name": "AggArgs", "symbols": [{"literal":"("}, (lexer.has("identifier") ? {type: "identifier"} : identifier), {"literal":")"}], "postprocess": (d) => [d[1].text]},
    {"name": "AggArgs", "symbols": [{"literal":"("}, (lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":","}, "_", (lexer.has("identifier") ? {type: "identifier"} : identifier), {"literal":")"}], "postprocess": (d) => [d[1].text, d[5].text]},
    {"name": "AggArgs", "symbols": [{"literal":"("}, (lexer.has("number") ? {type: "number"} : number), "_", {"literal":","}, "_", (lexer.has("number") ? {type: "number"} : number), {"literal":")"}], "postprocess": (d) => [d[1].text, d[5].text]},
    {"name": "Name", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => d[0].text},
    {"name": "Label", "symbols": [], "postprocess": (d) => undefined},
    {"name": "Label", "symbols": ["__", (lexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => d[1].value},
    {"name": "Icon", "symbols": [], "postprocess": (d) => undefined},
    {"name": "Icon", "symbols": ["__", {"literal":"<"}, "_", (lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":">"}], "postprocess": (d) => d[3].text},
    {"name": "Groups", "symbols": [], "postprocess": (d) => undefined},
    {"name": "Groups", "symbols": ["__", {"literal":"("}, "GroupList", {"literal":")"}], "postprocess": (d) => d[2]},
    {"name": "GroupList", "symbols": ["_", "GroupName", "_"], "postprocess": (d) => [d[1]]},
    {"name": "GroupList", "symbols": ["GroupList", {"literal":","}, "_", "GroupName", "_"], "postprocess": (d) => d[0].concat(d[3])},
    {"name": "GroupName", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => d[0].text},
    {"name": "Tags", "symbols": [], "postprocess": (d) => undefined},
    {"name": "Tags", "symbols": ["__", {"literal":"["}, "TagList", {"literal":"]"}], "postprocess": (d) => d[2]},
    {"name": "TagList", "symbols": ["_", "Tag", "_"], "postprocess": (d) => [d[1]]},
    {"name": "TagList", "symbols": ["TagList", {"literal":","}, "_", "Tag", "_"], "postprocess": (d) => d[0].concat(d[3])},
    {"name": "Tag", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => d[0].text},
    {"name": "Tag", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => d[0].value},
    {"name": "Metadata", "symbols": [], "postprocess": (d) => undefined},
    {"name": "Metadata", "symbols": ["__", {"literal":"{"}, "MetadataList", {"literal":"}"}], "postprocess": (d) => d[2]},
    {"name": "MetadataList", "symbols": ["_", "MetadataEntry", "_"], "postprocess": (d) => [d[1]]},
    {"name": "MetadataList", "symbols": ["MetadataList", {"literal":","}, "_", "MetadataEntry", "_"], "postprocess": (d) => d[0].concat(d[3])},
    {"name": "MetadataEntry", "symbols": ["MetadataKey", "_", {"literal":"="}, "_", "MetadataValue"], "postprocess": (d) => { return { key: d[0], value: d[4] } }},
    {"name": "MetadataKey", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => d[0].text},
    {"name": "MetadataValue", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => d[0].value},
    {"name": "MetadataValue", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => parseInt(d[0].value)},
    {"name": "MetadataValue", "symbols": [(lexer.has("string") ? {type: "string"} : string), "_", "MetadataConfig"], "postprocess": (d) => { return { value: d[0].value, config: d[2] } }},
    {"name": "MetadataConfig", "symbols": [{"literal":"["}, "MetadataConfigList", {"literal":"]"}], "postprocess": (d) => [d[1]]},
    {"name": "MetadataConfigList", "symbols": ["_", "MetadataConfigItem", "_"], "postprocess": (d) => [d[1]]},
    {"name": "MetadataConfigList", "symbols": ["MetadataConfigList", {"literal":","}, "_", "MetadataConfigItem", "_"], "postprocess": (d) => d[0].concat(d[3])},
    {"name": "MetadataConfigItem", "symbols": ["MetadataConfigKey", "_", {"literal":"="}, "_", "MetadataConfigValue"], "postprocess": (d) => { return { key: d[0], value: d[4] } }},
    {"name": "MetadataConfigKey", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (d) => d[0].text},
    {"name": "MetadataConfigValue", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => d[0].value},
    {"name": "MetadataConfigValue", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => parseInt(d[0].value)},
    {"name": "_", "symbols": [], "postprocess": () => null},
    {"name": "_", "symbols": ["_", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": () => null},
    {"name": "_", "symbols": ["_", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": () => null},
    {"name": "_", "symbols": ["_", (lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": () => null},
    {"name": "_", "symbols": ["_", (lexer.has("commentblock") ? {type: "commentblock"} : commentblock)], "postprocess": () => null},
    {"name": "__", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": () => null},
    {"name": "__", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": () => null},
    {"name": "__", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": () => null},
    {"name": "__", "symbols": [(lexer.has("commentblock") ? {type: "commentblock"} : commentblock)], "postprocess": () => null},
    {"name": "__", "symbols": ["__", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": () => null},
    {"name": "__", "symbols": ["__", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": () => null},
    {"name": "__", "symbols": ["__", (lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": () => null},
    {"name": "__", "symbols": ["__", (lexer.has("commentblock") ? {type: "commentblock"} : commentblock)], "postprocess": () => null}
]
  , ParserStart: "Main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
