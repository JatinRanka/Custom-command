#!/usr/bin/env node

// External dependencies
const { program } = require('commander');

// Version from package.json
const { version } = require('../package.json');

// Helper functions
const actions = require('../lib/actions.js');


program
    .version(version, '-v, --vers', 'output the current version');

 
program
    .command('add')
    .description('To add/save new directory/command')
    .option('-u --url', 'Use this to add websites')
    .option('-c --custom', 'Use this to add custom commands')
    .action(async function (cmdObj) {
        if(cmdObj.url){
            actions.addNewWebsite();
        } else if(cmdObj.custom){
            actions.addCustomCommand();
        } else{
            const path = process.cwd(); 
            await actions.addNewDirectory(path);
        }
    });
 

program
    .command('open [projectToOpen]')
    .description('To open existing projects')
    .action(async function(projectToOpen){
        await actions.openProject(projectToOpen);
    });

program
    .command('delete')
    .description('To delete an existing project')
    .action(async function(){
        await actions.deleteProject();
    })

program
    .command('rmeditor')
    .description('To remove the current default editor')
    .action(function(){
        actions.removeEditor();
    });

program
    .command('seteditor')
    .description('To set default editor')
    .action(function(){
        actions.setEditor();
    });

program
    .command('rmbrowser')
    .description('To remove the current default browser')
    .action(function(){
        actions.removeBrowser();
    });


program.parse(process.argv);
