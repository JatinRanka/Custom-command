// Node Internal modules
const fs = require('fs');
const fsPromise = fs.promises;
const util = require('util');
const os = require('os');
const path = require('path');
const exec = util.promisify(require('child_process').exec); // Util.promisify will convert exec() to return promise instead of callback. 

// External dependencies
const prompts = require('prompts');

// Path to file where data is stored
const dataFilePath = path.join(os.homedir(), 'custom-command', 'data.json');


const promptQuestion = async function(question) {
    try {
        const response = await prompts({
            type: 'text',
            name: 'answer',
            message: question
        });
        return response.answer;
    } catch (err) {
        throw (err);
    }
}

const promptConfirm = async function(question){
    try {
        const response = await prompts({
            type: 'confirm',
            name: 'value',
            message: question
        });
        return response.value;
    } catch (err) {
        throw (err);
    }
}

const promptSelect = async function(choices, message){
    try {
        const response = await prompts({
            type: 'select',
            name: 'value',
            message,
            choices
        })
        return response.value;
    } catch (err) {
        throw (err);
    }
}

const setDefaultEditor = async function(data){
    try{
        const message = 'Choose your default editor:'
        const choices = [
            { title: 'VS Code', value: 'vscode' },
            { title: 'Atom', value: 'atom' }
        ];
  
        const defaultEditor = await promptSelect(choices, message);

        data.defaultEditor = defaultEditor;

        // This will update the default editor in data file.
        await updateDataFile(data);
        return defaultEditor;

    } catch(err){
        throw (err);
    }
}

const getDefaultEditor = async function(data){
    try{
        if(data.defaultEditor){
            return data.defaultEditor;
        }
        return setDefaultEditor(data);
    } catch(err) {
        throw (err);
    }

}

const getDefaultBrowser = async function(data){
    try{
        if(data.defaultBrowser){
            return data.defaultBrowser;
        }

        const response = await prompts({
            type: 'select',
            name: 'browser',
            message: 'Choose your default browser.',
            choices: [
                { title: 'Chrome', value: 'chrome' }
            ],
        });
        
        const defaultBrowser = response.browser;
        data.defaultBrowser = defaultBrowser;

        // This will update the default editor in data file.
        await updateDataFile(data);
        return defaultBrowser;

    } catch(err){
        throw (err);;
    }
}

    
const openDirectory = async function(project){
    try {
        switch (project.platform) {
            case "vscode":
                await exec(`cd ${project.path} && code .`);
                break;
    
            case "atom":
                await exec(`cd ${project.path} && atom .`)
                break;
        
            default:
                break;
        }        
    } catch (err) {
        throw (err);
    } 
}

const openWebsite = async function(project){
    try {
        switch (project.platform) {
            case "chrome":
                await exec(`start chrome ${project.path}`)
                break;
        
            default:
                break;
        }
    } catch (err) {
        throw (err);
    }
    
}

const executeCommand = async function(command){
    try {
        await exec(command)
    } catch (err) {
        throw (err);
    }
}

const updateDataFile = async function(data){
    return fsPromise.writeFile(dataFilePath, JSON.stringify(data, null, 4), 'utf-8');
}

const getData = async function(){
    try {
        // If data file doesn't exists, create new one.
        if(!fs.existsSync(dataFilePath)){
            // Creating a new directory (named custom-command) in home dir.
            await fsPromise.mkdir( path.join(os.homedir(), 'custom-command') );

            let initialData = {
                defaultBrowser: '',
                defaultEditor: '',
                projects: {}
            };

            await updateDataFile(initialData);
        }
        
        var data = require(dataFilePath);
        return data;
    } catch (err) {
        throw (err);
    }
}

const verifyProjectName = async function(data, projectName){
    try {
        // Repeat loop till the projectName exists (ie till projectName is not unique).
        while (projectName in data.projects){
            var override = await promptConfirm("Project with same name already exists. Would you like to override the existing project?");
            if(override === true){
                break;
            }
            projectName = await promptQuestion("Enter new name for project: ")
        }

        return projectName;   

    } catch (err) {
        throw (err)
    }
}

module.exports = {
    promptQuestion, 
    getDefaultEditor, 
    getDefaultBrowser, 
    promptSelect, 
    openDirectory, 
    openWebsite, 
    setDefaultEditor, 
    updateDataFile, 
    executeCommand, 
    getData,
    verifyProjectName
};