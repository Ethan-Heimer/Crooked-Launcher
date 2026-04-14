const { app, BrowserWindow, ipcMain } = require('electron')
const { setTimeout } = require('node:timers/promises');

const path = require('path');
const fs = require('node:fs');
const os = require('os')

let win = null;

const createWindow = (frontendPath) => {
    win = new BrowserWindow({
        width: 650,
        height: 450,
        frame: false,
        transparent: true,
        webPreferences: {
            preload: path.join(__dirname, '/preload.js')
        }
    })

    //load html
    win.loadFile(`${frontendPath}index.html`)

    //load config css
    win.webContents.on('did-finish-load', () => {
        const userInfo = os.userInfo();
        const username = userInfo.username;

        fs.readFile(`/Users/${username}/.config/crookedlauncher/styles.css`, 'utf8', (err, data) => {
            win.webContents.insertCSS(data);
        }) 

    });

}

const InitializeApp = async (frontendPath) => {
    const API = require('./api.js')

    let active = false;
    app.whenReady().then(async () => {
        ipcMain.handle('Exit', () => app.quit())
        ipcMain.handle('Grep', async (event, pattern) => API.GetApplications(pattern))
        ipcMain.handle('Open', (error, application) => API.OpenApp(application))

        createWindow(frontendPath);
        app.on('activate', async () => {
            if (BrowserWindow.getAllWindows().length === 0) 
                createWindow(frontendPath);
        })

        active = true;

    })
 
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    while(!active){
        await setTimeout(10)
    }

    return true;
}

const SendLostKeys = async (keys) => {
    console.log("Found Keys: " + keys)

    win.webContents.on('did-finish-load', () => {
        win.webContents.send("FoundKeys", keys);
    })
}

const Quit = () => {
    app.quit();
}

module.exports = {
    InitializeApp, Quit, SendLostKeys
}
