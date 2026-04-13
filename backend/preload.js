const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
})

contextBridge.exposeInMainWorld('API', {
    Exit: () => ipcRenderer.invoke("Exit"),
    Grep: (pattern) => ipcRenderer.invoke("Grep", pattern),
    Open: (application) => ipcRenderer.invoke("Open", application)
})
