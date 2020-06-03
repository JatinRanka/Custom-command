// Node Internal modules
const fs = require('fs');
const fsPromise = fs.promises;
const os = require('os');
const path = require('path');

// External dependencies
const prompts = require('prompts');
const { exec } = require("child-process-promise");


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
        throw (err.message);
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
        throw (err.message);
    }
}

const setDefaultEditor = async function(data){
    try{
        const message = 'Choose your default editor:'
        const choices = [
            { title: 'VS Code', value: 'vscode' },
            { title: 'green', value: 'green' }
        ];
  
        const defaultEditor = await promptSelect(choices, message);

        data.defaultEditor = defaultEditor;

        // This will update the default editor in data file.
        await updateDataFile(data);
        return defaultEditor;

    } catch(err){
        throw (err.message);
    }
}

const getDefaultEditor = async function(data){
    try{
        if(data.defaultEditor){
            return data.defaultEditor;
        }
        return setDefaultEditor(data);
    } catch(err) {
        throw (err.message);
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
        throw (err.message);;
    }
}

    
const openDirectory = async function(project){
    try {
        switch (project.platform) {
            case "vscode":
                exec(`cd ${project.path} && code .`)
                break;
    
            case "atom":
                break;
        
            default:
                break;
        }        
    } catch (err) {
        throw (err.message);
    } 
}

const openWebsite = async function(project){
    try {
        switch (project.platform) {
            case "chrome":
                exec(`start chrome ${project.path}`)
                break;
        
            default:
                break;
        }
    } catch (err) {
        throw (err.message);
    }
    
}

const executeCommand = async function(command){
    try {
        await exec(command)
    } catch (err) {
        throw (err.message);
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
        throw (err.message);
    }
}

module.exports = {promptQuestion, getDefaultEditor, getDefaultBrowser, promptSelect, openDirectory, openWebsite, setDefaultEditor, updateDataFile, executeCommand, getData};