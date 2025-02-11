// External dependencies
const chalk = require('chalk');

// helper functions
const {
    promptQuestion, 
    promptSelect,
    getDefaultEditor, 
    getDefaultBrowser, 
    openDirectory,
    openWebsite,
    setDefaultEditor,
    updateDataFile,
    executeCommand,
    getData,
    verifyProjectName
} = require('./utils.js');


const addNewDirectory = async function(path, platform){
    try {
        var data = await getData();
        var projectName = await promptQuestion("What is the name of project?");
        projectName = await verifyProjectName(data, projectName);

        if (!projectName){
            throw ("Project name cant be empty.")
        }

        if(!platform){
            var platform = await getDefaultEditor(data);
        }

        data.projects[projectName] = {
            path,
            platform,
            "type": "directory"
        };

        await updateDataFile(data);
        console.log(chalk.green("Project added successfully."));

    } catch (err) {
        console.log(chalk.red(err));
    }
}

const addNewWebsite = async function(){
    try{
        var data = await getData();
        var platform = await getDefaultBrowser(data);
        
        var path = await promptQuestion("Enter the url of website:");
        var projectName = await promptQuestion("What is the name you would like to save?");
        projectName = await verifyProjectName(data, projectName);

        if(!path || !projectName){
            throw ("Url and name both should be filled.")
        }

        data.projects[projectName] = {
            path,
            platform,
            "type": "url"
        }

        await updateDataFile(data);
        console.log(chalk.green("Project added successfully."));

    } catch(err){
        console.log(chalk.red(err));
    }
}

const addCustomCommand = async function(){
    try {
        var data = await getData();
        
        const command = await promptQuestion("Enter the custom command to be executed: ");
        var projectName = await promptQuestion("Enter the name of custom command: ");
        projectName = await verifyProjectName(data, projectName);

        if(!projectName || !command){
            throw ("Project name and command both should be filled.")
        }

        data.projects[projectName] = {
            command,
            type: "custom"
        };

        await updateDataFile(data);
        console.log(chalk.green("Custom command added successfully."));

    } catch (err) {
        console.log(chalk.red(err));
    }
}

const openProject = async function(projectToOpen){
    try {
        const data = await getData();
        const projects = data.projects;

        // Check if projectToOpen is provided (by user) or not.
        if(typeof projectToOpen == "undefined"){

            // If there are no projects available.
            if (Object.keys(projects).length === 0){
                throw ("No projects available. Use 'cc add -h' to add projects.")
            }

            let choices = Object.keys(projects);

            choices.forEach((element, index) => {
                choices[index] = {
                    title: element,
                    value: element
                }
            });

            let message = 'Select the project to open:'
            var projectToOpen = await promptSelect(choices, message);
        }

        const project = projects[projectToOpen];

        if(!project){
            throw (`Project with the name ${projectToOpen} doesn't exist.`)
        }

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
        };

    } catch (err) {
        console.log(chalk.red(err));
    }
}

const deleteProject = async function(){
    try {
        var data = await getData();
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
        console.log(chalk.green("Project deleted successfully."));

    } catch (err) {
        console.log(chalk.red(err));
    }
}

const removeEditor = async function(){
    try {
        var data = await getData();
        data.defaultEditor = "";
        await updateDataFile(data);
        console.log(chalk.green("Default editor removed."));
    } catch (err) {
        console.log(chalk.red(err));
    }    
}


const setEditor = async function(){
    try{
        var data = await getData();
        await setDefaultEditor(data);
    } catch(err){
        console.log(chalk.red(err));
    }
}   

const removeBrowser = async function(){
    try{
        var data = await getData();
        data.defaultBrowser = "";
        await updateDataFile(data);
        console.log(chalk.green("Default Browser removed."));
    } catch(err){
        console.log(chalk.red(err));
    } 
}



module.exports = {addNewDirectory, addCustomCommand, openProject, addNewWebsite, removeEditor, setEditor, removeBrowser, deleteProject}