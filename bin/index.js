#!/usr/bin/env node

const { program } = require('commander');
const actions = require('../lib/actions.js');
 
program
    .command('add')
    .option('-u --url', 'URL')
    .option('-c --custom')
    .action(function (cmdObj) {
        if(cmdObj.url){
            // console.log("in url");return;
            actions.addNewWebsite();
        } else if(cmdObj.custom){
            // console.log("in custom");return;
            actions.addCustomCommand();
        } else{
            // console.log("in normal");return;
            const path = process.cwd(); 
            actions.addNewDirectory(path);
        }
    });
 

program
    .command('open')
    .action(function(){
        actions.openProject();
    });

program
    .command('delete')
    .action(function(){
        actions.deleteProject();
    })

program
    .command('rmeditor')
    .action(function(){
        actions.removeEditor();
    });

program
    .command('seteditor')
    .action(function(){
        actions.setEditor();
    });

program
    .command('rmbrowser')
    .action(function(){
        actions.removeBrowser();
    });


   


program.parse(process.argv)
