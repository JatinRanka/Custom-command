#!/usr/bin/env node


// External dependencies
const { program } = require('commander');

// Helper functions
const actions = require('../lib/actions.js');


program.version('0.0.1', '-v, --vers', 'output the current version');

 
program
    .command('add')
    .option('-u --url', 'Use this to add websites')
    .option('-c --custom', 'Use this to add custom commands.')
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
    .command('open [projectToOpen]')
    .action(async function(projectToOpen){
        await actions.openProject(projectToOpen);
    });

program
    .command('delete')
    .action(async function(){
        await actions.deleteProject();
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
