const { execSync } = require('child_process');
const { nativeImage } = require('electron');

const path = require('path');

function GetApplications(pattern){
    if(pattern == ""){
        return {message: "No Apps Found"}
    }

    try {
        const stdout = execSync(`find / -iname '${pattern}*.app' -maxdepth 4 2> /dev/null | grep '.app'`);
        const apps = stdout.toString().split('\n');
        let results = [];

        for(let i = 0; i < apps.length-1; i++){
            const application = apps[i];

            let appData = {}
            appData.application = application;
            appData.name = GetAppName(application);

            results.push(appData)
        }

        return {results};
    } catch (error){
        console.error("Error: " + error.message)
        return {message: "No Apps Found"};
    }
}

function OpenApp(application){
    execSync(`open ${application}`);
}

function GetAppName(application){
    return path.parse(application).name;
}

module.exports = {
    GetApplications, OpenApp
}
