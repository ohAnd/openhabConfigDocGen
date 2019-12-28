// get the some content from https://raw.githubusercontent.com/openhab/openhab-vscode/master/meta/openhab.tmLanguage.json
// at this time only the important keywords, has to be 'more' finished
'use strict';
exports.openhabLang = function() {
  /* eslint-disable */
  return Prism.languages.openhab = {
  /* eslint-enable */
    // for using inside original prism module, put this part i a file insde ../components
    // Prism.languages.openhab = {
    comment: [
      {
        pattern: /\/\/.*/,
      },
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true,
      },
      {
        pattern: /(^|[^\\])\/\/.*/,
        lookbehind: true,
      },
      {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true,
      },
    ],
    atrule: {
      pattern: /((^|[\r\n]+)[^ ]+=).*(?:$|[\r\n]+)/,
      lookbehind: true,
    },
    constant: /ON|OFF/,
    string: {
      pattern: /"[^"]*"/,
      greedy: true,
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: [
      /(^|[\r\n]+)([A-Z]{1}[a-z]+) /,
      /(^|[\r\n\s]+)(sitemap|rule|when|then|end|Item|Frame|Default|Switch|Slider|Text)/,
      /Item|changed to|changed/,
    ],
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/,
    variable: /(^|[\r\n]+)[a-zA-Z0-9._]+(?==)/,
  };
};
