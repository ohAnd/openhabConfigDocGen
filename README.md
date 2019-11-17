# openhabConfigDocGen

- [openhabConfigDocGen](#openhabconfigdocgen)
  - [Description](#description)
  - [Actual features](#actual-features)
  - [ToDo's](#todos)
  - [Usage](#usage)
  - [Installation](#installation)
  - [Debugging](#debugging)
    - [execute with debugging on](#execute-with-debugging-on)
  - [Testing](#testing)

## Description

A tool to generate a good looking browserable overview for your own openhab configuration.
In the first step only for the data in config files. Planned for future, to get all information of the database of openhab too. (e.g. thing configuration)

## Actual features
- basic html/ css/ js - template integrated for customization
- grab the give folder recursivly for known openhab config file formats
- show the folder/ file structure in the navigation tree with expand/ collpase
- show the content of each file on site

## ToDo's
- highlighting for ESH Code
- searching the files for keywords
- cluster the hierarchy of rules, groups, items
- ...


## Usage

to execute the generator start with the following command:

    node ohConfigDocGen.cli.js <srcfolder_of_openhab_config> <targetfolder_for_output>

## Installation

1. fetch the master branch
2. navigate to downloded folder
3. in commandline
   1.     npm install openhab_config_doc_gen

---

## Debugging

### execute with debugging on

to execute with debugging on:

    DEBUG=* node ohConfigDocGen.cli.js <srcfolder_of_openhab_config> <targetfolder_for_output>

## Testing
 t.b.d.