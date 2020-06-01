const prompts = require('prompts');
const { exec } = require("child-process-promise");
const fs = require('fs').promises;


const promptQuestion = async function(question) {
    const response = await prompts({
        type: 'text',
        name: 'answer',
        message: question
    });
    return response.answer;
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
        
    }
}

const setDefaultEditor = async function(data, dataFilePath){
    try{
        const message = 'Choose your default editor:'
        const choices = [
            { title: 'VS Code', value: 'vscode' },
            { title: 'green', value: 'green' }
        ];
  
        const defaultEditor = await promptSelect(choices, message);

        console.log(data)

        data.defaultEditor = defaultEditor;
        

        // This will update the default editor in data file.
        var writeResponse = await fs.writeFile(dataFilePath, JSON.stringify(data, null, 4), 'utf-8');
        return defaultEditor;

    } catch(err){
        console.log(err);
    }
}

const getDefaultEditor = async function(data, dataFilePath){
    try{
        if(data.defaultEditor){
            return data.defaultEditor;
        }
        return setDefaultEditor(data, dataFilePath);
    } catch(err) {
        console.log(err);
    }

}

const getDefaultBrowser = async function(data, dataFilePath){
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
        var writeResponse = await fs.writeFile(dataFilePath, JSON.stringify(data, null, 4), 'utf-8');
        return defaultBrowser;

    } catch(err){
        console.log(err);
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
        console.log(err);
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
        console.log(err);
    }
    
}

const executeCommand = async function(command){
    try {
        await exec(command)
    } catch (err) {
        console.log(err);
    }
}

const updateDataFile = async function(data){
    return fs.writeFile('./data/index.json', JSON.stringify(data, null, 4), 'utf-8');
}

module.exports = {promptQuestion, getDefaultEditor, getDefaultBrowser, promptSelect, openDirectory, openWebsite, setDefaultEditor, updateDataFile, executeCommand};