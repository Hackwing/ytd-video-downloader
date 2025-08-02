// preload.js (Electron preload script)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    chooseFolder: () => ipcRenderer.invoke('choose-folder'),
    downloadSong: (url, folder, format) => ipcRenderer.invoke('download-song', url, folder, format)
});
