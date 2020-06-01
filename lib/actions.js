const {
    promptQuestion, 
    promptSelect,
    getDefaultEditor, 
    getDefaultBrowser, 
    openDirectory,
    openWebsite,
    setDefaultEditor,
    updateDataFile,
    executeCommand
} = require('./utils.js');


// dataFilePath is called from the root directory 
// of the project to write data.
const dataFilePath = './data/index.json';

// This will fetch data and is called from the current file.
const data = require('../data/index.json');


const addNewDirectory = async function(path, platform){
    try {
        const projectName = await promptQuestion("What is the name of project?");

        if(!platform){
            var platform = await getDefaultEditor(data, dataFilePath);
        }

        data.projects[projectName] = {
            path,
            platform,
            "type": "directory"
        };

        await updateDataFile(data);
        console.log("Project added successfully.");

    } catch (err) {
        console.log(err);
    }
}

const addNewWebsite = async function(platform){
    try{
        // console.log("in try");
        var path = await promptQuestion("Enter the url of website:");
        var projectName = await promptQuestion("What is the name you would like to save?");

        if(!platform){
            var platform = await getDefaultBrowser(data, dataFilePath);
        }

        data.projects[projectName] = {
            path,
            platform,
            "type": "url"
        }

    await updateDataFile(data);
    console.log("Project added successfully.");

    } catch(err){
        console.log(err);
    }
}

const addCustomCommand = async function(){
    try {
        const projectName = await promptQuestion("Enter the name of custom command: ");
        const command = await promptQuestion("Enter the custom command to execute: ");

        data.projects[projectName] = {
            command,
            type: "custom"
        };

        await updateDataFile(data);
        console.log("Custom command added successfully.");

    } catch (err) {
        console.log(err);
    }
}

const openProject = async function(){
    try {
        const projects = data.projects;
        let choices = Object.keys(projects);

        choices.forEach((element, index) => {
            choices[index] = {
                title: element,
                value: element
            }
        });

        let message = 'Select the project to open:'
        const projectToOpen = await promptSelect(choices, message);

        const project = projects[projectToOpen];

        // if (project.type == "directory") {
        //     openDirectory(project);
        // } else if (project.type == "url") {
        //     openWebsite(project);
        // }

        switch (project.type) {
            case "directory":
                await openDirectory(project);
                break;

            case "url":
                await openWebsite(project);
                break;
            
            case "custom":
                await executeCommand(project.command);

            default:
                break;
        }


    } catch (err) {
        console.log(err);
    }
}

const deleteProject = async function(){
    try {
        const projects = data.projects;
        let choices = Object.keys(projects);

        choices.forEach((element, index) => {
            choices[index] = {
                title: element,
                value: element
            }
        });

        let message = 'Select the project to delete:'
        const projectToDelete = await promptSelect(choices, message);

        delete data.projects[projectToDelete];

        await updateDataFile(data);
        console.log("Project deleted successfully.");

    } catch (err) {
        console.log(err);
    }
}

const removeEditor = async function(){
    try {
        data.defaultEditor = "";
        await updateDataFile(data);
        console.log("Default editor removed.");
    } catch (err) {
        console.log(err);
    }    
}


const setEditor = async function(){
    try{
        await setDefaultEditor(data, dataFilePath);
    } catch(err){
        console.log(err);
    }
}


const removeBrowser = async function(){
    try{
        data.defaultBrowser = "";
        await updateDataFile(data);
        console.log("Default Browser removed.");
    } catch(err){
        console.log(err);
    }
    
}


module.exports = {addNewDirectory, addCustomCommand, openProject, addNewWebsite, removeEditor, setEditor, removeBrowser, deleteProject}