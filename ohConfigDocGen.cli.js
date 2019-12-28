#!/usr/bin/env node

'use strict';

var myArgs = process.argv.slice(2);

var debug = require('debug')('debug');
const Prism = require('prismjs');
var fs = require('fs');

// workaround to use an own language description for highligthing
var langOpenhab = require('./language/prism-openhab.js');
/* eslint-disable */
let openhab = langOpenhab.openhabLang();
/* eslint-enable */

var version = '1.1.0';

const srcOHfolder = myArgs[0];
const targetOutfolder = myArgs[1];


var menuContent = {};
var numFolders = 0;
var numFiles = 0;
var globalItemsRegistry = [];


// ##############################################################


// get folder structure
readSrcFolder(srcOHfolder);

var fileName = targetOutfolder + '/test.html';

var html = buildHtml();

fs.writeFile(fileName, html, function(err) {
  if (err) {
    return console.log(err);
  }

  debug('The file was saved!');
});


function buildHtml(req) {
  var title = 'openhab Config Docu';
  var footer = '<div><p>' + title + ' - version: ' + version +
                '</p><p class="w3-small">build on ' + new Date() + '</p></div>';

  var template = getTemplate();
  template = template.replace('$$TITLE$$', title);
  template = template.replace('$$TITLEPAGE$$', title);
  template = template.replace('$$LOGO$$', title);
  template = template.replace('$$FOOTER$$', footer);

  template = template.replace(/\$%NUM_FOLDERS%\$/g, numFolders);
  template = template.replace(/\$%NUM_FILES%\$/g, numFiles);
  template = template.replace(/\$%VERSION%\$/g, version);

  template = addMenuStructure(template);

  template = addFiles(template);

  template = exportItems(template);

  template = template.replace(/\$%NUM_ITEMS%\$/g, Object.keys(globalItemsRegistry).length);

  return template;
};

function readOHfile(pathToFile) {
  var fs = require('fs');
  var buffer = fs.readFileSync(pathToFile);
  return buffer.toString();
}

function getTemplate() {
  var pathToTemplate = 'templates/main.html';
  return readOHfile(pathToTemplate);
}

function addMenuStructure(templateString) {
  var strPart = '';
  strPart = templateString.split('<!-- $%MENUITEMS_START%$ -->');
  strPart = strPart[1].split(' <!-- $%MENUITEMS_END%$ -->');

  // put the menu in extracted string
  var newTemplatePart = strPart[0];
  // prototype for menu item
  var menuLine = newTemplatePart;
  // empty the newPart for filling with reald data
  newTemplatePart = '';

  debug('create menu');

  for (var name in menuContent) {
    var newEntry = menuLine.replace(/\$%MENU_ITEM%\$/g, name);
    newEntry = newEntry.replace('$$MENU_ITEM_LINK$$', '#' + name);
    // substructure
    var newSubBlock = '';
    var strSubPart = newEntry.split('<!-- $%MENUITEMS_SUB_START%$ -->');
    strSubPart = strSubPart[1].split(' <!-- $%MENUITEMS_SUB_END%$ -->');
    var menuSubLine = strSubPart[0];

    if (menuContent[name] instanceof Object) {
      for (var nameSub in menuContent[name]) {
        var newSubEntry = menuSubLine.replace(/\$\$MENU_SUB_ITEM\$\$/g, nameSub);
        newSubEntry = newSubEntry.replace('$$MENU_ITEM_LINK$$', '#' + nameSub);
        newSubBlock = newSubBlock + newSubEntry;
        // debug('  new sub menu entry: '+nameSub + ' line: '+newSubBlock);
      }
    }
    // fill with sub block, empty when no sub
    newEntry = newEntry.replace(menuSubLine, newSubBlock);

    newTemplatePart = newTemplatePart + newEntry;
    debug(' new menu entry: ' + name);
  };

  // remove the template string from template
  templateString = templateString.replace(strPart[0], newTemplatePart);

  //    $$MENU_ITEM$$

  return templateString;
}

function addFiles(templateString) {
  var newFileContent = '';

  // iterate FileList
  for (var name in menuContent) {

    // substructure
    if (menuContent[name] instanceof Object) {
      for (var nameSub in menuContent[name]) {
        // if(menuContent[name][nameSub] != "X:\\rules\\Strom.rules") continue;
        debug('read file: ' + menuContent[name][nameSub]);
        var filecontent = readOHfile(menuContent[name][nameSub]);
        if (menuContent[name][nameSub].endsWith('.items')) {
          //global ItemsRegistry = {...globalItemsRegistry, ...getItems(filecontent)};
          globalItemsRegistry = globalItemsRegistry.concat(getItems(filecontent));
          debug('items sum ' + Object.keys(globalItemsRegistry).length);
        }
        newFileContent +=
                '<div class="w3-panel w3-card w3-light-grey w3-hide closeable" id="' + nameSub + '">' +
                    '<h3>' + nameSub + '</h3>' +
                    '<div class="w3-code w3-small notranslate">' +
                        '<pre><code>' + enocdeForHtml(filecontent) + '</code></pre>' +
                    '</div>' +
                '</div>';

      }
    }
  }
  // sort items for name
  globalItemsRegistry.sort(function(a, b) {
    var nameA = a.name;
    var nameB = b.name;
    if (nameA < nameB) { return -1; }
    if (nameA > nameB) { return 1; }
    return 0;
  });

  templateString = templateString.replace('$%CONTENT_FILE%$', newFileContent);

  return templateString;
}

function enocdeForHtml(str) {

  var Normalizer = require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace');
  // Create a new Normalizer object
  var nw = new Normalizer({
    'remove-trailing': true,
    'remove-indent': true,
    'left-trim': true,
    'right-trim': true,
    'break-lines': 100,
    // 'indent': 2,
    // 'remove-initial-line-feed': false,
    // 'tabs-to-spaces': 4,
    // 'spaces-to-tabs': 4
  });

  // Removes leading and trailing whitespace
  // and then indents by 1 tab
  str = nw.normalize(str, { });

  str = Prism.highlight(str, Prism.languages.openhab, 'openhab');

  return str;
}

function readSrcFolder(srcFolder) {
  debug('get folder structure for: ' + srcFolder);
  const dirTree = require('directory-tree');
  const tree = dirTree(srcFolder, { extensions: /\.(rules|items|persist|script|cfg|json|sitemap|things|map)$/ });

  Object.keys(tree.children).forEach(function(key) {
    var val = tree.children[key];
    if (val.type === 'directory' && !((val.name).startsWith('.')) && val.size !== 0) {
      debug('folder (' + key + '): ' + val.name);
      Object.keys(val.children).forEach(function(key2) {
        var val2 = val.children[key2];
        if (val2.type === 'file') {
          if (!(val.name in menuContent)) {
            menuContent[val.name] = {};
            numFolders++;
          };
          menuContent[val.name][val2.name] = val2.path;
          numFiles++;
        }
      });
    }
  });

  debug('get folder structure for: ' + srcFolder + ' END');
}

function getItems(itemFileStr) {
  const nearley = require('nearley');
  var grammar = require('./language/items.js');
  try {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed((itemFileStr.replace(/[\r\n]+/g, '\n')).trim());
    if (!parser.results.length)
      return 'Unable to parse or no items were found, check your input';

    // var jsonItems = JSON.stringify(
    //   parser.results[0].filter(i => i !== null),
    //   null,
    //   4,
    // );
    var jsonItems = parser.results[0];

    debug('items ' + Object.keys(jsonItems).length);

    return jsonItems;
  } catch (e) {
    debug('error at parsing items' + e);
  }
}

function exportItems(templateString) {
  var newFileContent = '<div>';

  var groupContent = `<div id="itemsregistry_groups" class="w3-hide"><h3>groups</h3>
      <table class="w3-table-all w3-hoverable">
      <tr>
        <th>name</th>
        <th>label</th>
        <th>category</th>
        <th>tags</th>
        <th>parent groups</th>
      </tr>`;
  var itemsContent = `<div id="itemsregistry_items" class="w3-hide"><h3>items</h3>
      <table class="w3-table-all w3-hoverable">
      <tr>
        <th>name</th>
        <th>type</th>
        <th>label</th>
      </tr>
  `;

  for (var key in globalItemsRegistry) {
    if (globalItemsRegistry[key].type === 'Group') {
      groupContent = groupContent +
        '<tr>' +
        '<td>' + globalItemsRegistry[key].name + '</td>' +
        '<td>' + globalItemsRegistry[key].label + '</td>' +
        '<td>' + globalItemsRegistry[key].category + '</td>' +
        '<td>' + globalItemsRegistry[key].tags + '</td>' +
        '<td>' + globalItemsRegistry[key].groupNames + '</td>' +
        '</tr>';
    } else {
      itemsContent = itemsContent +
      '<tr>' +
      '<td class="w3-tooltip">' + globalItemsRegistry[key].name +
        '<span style="position:absolute;left:100px;bottom:28px" class="w3-text w3-tag w3-animate-opacity">' +
        '<div class="w3-container">' +
          '<div class="w3-left-align">category: ' + globalItemsRegistry[key].category + '</div>' +
          '<div class="w3-left-align">tags: ' + globalItemsRegistry[key].tags + '</div>' +
          '<div class="w3-left-align">groups: ' + globalItemsRegistry[key].groupNames + '</div>' +
        '</div></span>' +
      '</td>' +
      '<td>' + globalItemsRegistry[key].type + '</td>' +
      '<td>' + globalItemsRegistry[key].label + '</td>' +
      // "<td>"+globalItemsRegistry[key].category+"</td>" +
      // "<td>"+globalItemsRegistry[key].tags+"</td>" +
      // "<td>"+globalItemsRegistry[key].groupNames+"</td>" +
      '</tr>';
    }
    // globalItemsRegistry[key].name
    // globalItemsRegistry[key].type
    // globalItemsRegistry[key].category
    // globalItemsRegistry[key].function
    // globalItemsRegistry[key].label
    // globalItemsRegistry[key].tags []
    // globalItemsRegistry[key].groupNames []
  }

  newFileContent = newFileContent +
                   groupContent + '</table></div>' +
                   itemsContent + '</table></div>' +
                   '</div>';

  templateString = templateString.replace('$%CONTENT_ITEMS%$', newFileContent);

  return templateString;
}
