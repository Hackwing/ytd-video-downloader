// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    chooseFolder: () => ipcRenderer.invoke('choose-folder'),
    downloadSong: (url, folder, mediaType, format, isPlaylist) =>
        ipcRenderer.invoke('download-song', url, folder, mediaType, format, isPlaylist)
});
