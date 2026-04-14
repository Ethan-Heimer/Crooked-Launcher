const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('API', {
    Exit: () => ipcRenderer.invoke("Exit"),
    Grep: (pattern) => ipcRenderer.invoke("Grep", pattern),
    Open: (application) => ipcRenderer.invoke("Open", application),

    onFoundKeys: (callback) => ipcRenderer.on("FoundKeys", (_event, value) => {
        console.log("foundKeys: " + value)
        callback(value)
    })
})
