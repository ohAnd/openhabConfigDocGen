#!/usr/bin/env node

const [,,  ...args] = process.argv
var myArgs = process.argv.slice(2);

var debug = require('debug')('debug')

var version = '1.0.0';

const srcOHfolder = myArgs[0];
const targetOutfolder = myArgs[1];

//readOHfile(myArgs[0]);

var fs = require('fs');

var menuContent = {};
var numFolders = 0;
var numFiles = 0;

//     "items":null,
//     "rules":{
//         "rule1":null,
//         "rule2":null,
//         "rule3":null,
//     },
//     "scripts":{
//         "script1":null,
//         "script2":null,
//         "script3":null,
//     },
// };

// get folder structure
readSrcFolder(srcOHfolder);



//##############################################################

var fileName = targetOutfolder+'/test.html';
var html = buildHtml();
fs.writeFile(fileName, html, function(err) {
    if(err) {
        return console.log(err);
    }

    debug("The file was saved!");
}); 

function buildHtml(req) {
    var title = 'openhab Config Docu';
    var header = '';
    var body = 'Noch ein test';
    var footer = '<div><p>'+title+' - version: '+version+'</p><p class="w3-small">build on '+new Date()+'</p></div>';

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

    return template;
  };

function readOHfile(pathToFile) {
var fs = require('fs');
//var path = process.cwd();
var buffer = fs.readFileSync(pathToFile);
//console.log(buffer.toString());
return buffer.toString();
}

function getTemplate() {
var pathToTemplate = 'templates/main.html';
return readOHfile(pathToTemplate);
}

function addMenuStructure(templateString) {
    var strPart = "";
    strPart = templateString.split("<!-- $%MENUITEMS_START%$ -->");
    strPart = strPart[1].split(" <!-- $%MENUITEMS_END%$ -->");

    // put the menu in extracted string
    var newTemplatePart = strPart[0];
    //prototype for menu item
    var menuLine = newTemplatePart;
    //empty the newPart for filling with reald data
    var newTemplatePart = '';

    debug("create menu");

    for(var name in menuContent) {
        var newEntry = menuLine.replace(/\$%MENU_ITEM%\$/g,name);
        newEntry = newEntry.replace('$$MENU_ITEM_LINK$$','#'+name);
        //substructure
        var newSubBlock = '';
        strSubPart = newEntry.split("<!-- $%MENUITEMS_SUB_START%$ -->");
        strSubPart = strSubPart[1].split(" <!-- $%MENUITEMS_SUB_END%$ -->");
        var menuSubLine = strSubPart[0];

        if(menuContent[name] instanceof Object) {
            for(var nameSub in menuContent[name]) {
                var newSubEntry = menuSubLine.replace(/\$\$MENU_SUB_ITEM\$\$/g,nameSub);
                newSubEntry = newSubEntry.replace('$$MENU_ITEM_LINK$$','#'+nameSub);
                newSubBlock = newSubBlock + newSubEntry;
                //debug('  new sub menu entry: '+nameSub + ' line: '+newSubBlock);
            }
        }
        //fill with sub block, empty when no sub
        newEntry = newEntry.replace(menuSubLine, newSubBlock);

        newTemplatePart = newTemplatePart + newEntry;
        debug(' new menu entry: '+name);
    };

    //remove the template string from template
    templateString = templateString.replace(strPart[0], newTemplatePart);

//    $$MENU_ITEM$$

    return templateString;
}

function addFiles(templateString) {
    var newFileContent = "";
    
    //iterate FileList
    for(var name in menuContent) {
        //substructure
        if(menuContent[name] instanceof Object) {
            for(var nameSub in menuContent[name]) {
                debug("read file: "+menuContent[name][nameSub]);
                var filecontent = readOHfile(menuContent[name][nameSub]);
                newFileContent += '<div class="w3-panel w3-card w3-light-grey w3-hide closeable" id="'+nameSub+'">'
                +'<h3>'+nameSub+'</h3>'
                +'<div class="w3-code notranslate">'+enocdeForHtml(filecontent)+'</div></div>';
            }
        }
    }

    templateString = templateString.replace("$%CONTENT_FILE%$",newFileContent);
    
    return templateString;
}

function enocdeForHtml( str ) {
    //return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0').replace(/\</g, '\<');
    var escape = require('escape-html');
    var html = escape(str);
    return html;
}

function readSrcFolder(srcFolder) {
    debug("get folder structure for: "+srcFolder);
    const dirTree = require("directory-tree");
    const tree = dirTree(srcFolder, { extensions: /\.(rules|items|persist|script|cfg|json|sitemap|things|map)$/  });
    const util = require('util');

    //console.log(util.inspect(tree, false, null, true /* enable colors */));

    // for(var name in dirTree.children) {
    //     debug("folder: "+name);
    // }
    Object.keys(tree.children).forEach(function(key) {
        var val = tree.children[key];
        if(val.type == "directory" && !((val.name).startsWith('.')) && val.size != 0) {
            debug("folder ("+key+"): "+val.name);
            Object.keys(val.children).forEach(function(key2) {
                var val2 = val.children[key2];
                if(val2.type == "file") {
                    //debug("sub ("+key2+"): "+val2.name);
                    if(!(val.name in menuContent)) {
                        menuContent[val.name] = {};
                        numFolders++;
                    };
                    menuContent[val.name][val2.name] = val2.path;
                    numFiles++;
                }                
            });
        }        
      });

    //console.log(util.inspect(menuContent, false, null, true /* enable colors */));

    debug("get folder structure for: "+srcFolder+" END");
}