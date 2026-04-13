const { app, BrowserWindow, ipcMain } = require('electron')

const fs = require('node:fs');
const os = require('os')
const path = require('node:path')

const API = require('./api.js')

const createWindow = (frontendPath) => {
    const win = new BrowserWindow({
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

const InitializeApp = (frontendPath) => {
    app.whenReady().then(() => {
        ipcMain.handle('Exit', () => app.quit())
        ipcMain.handle('Grep', async (event, pattern) => API.GetApplications(pattern))
        ipcMain.handle('Open', (error, application) => API.OpenApp(application))

        createWindow(frontendPath) 
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    })

    
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })
}

const Quit = () => {
    app.quit();
}

module.exports = {
    InitializeApp, Quit
}
