// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile(path.join(__dirname, 'dist/ytd-downloader/index.html'));

    win.on('closed', () => {
        win = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle('choose-folder', async (event) => {
    const parentWindow = BrowserWindow.fromWebContents(event.sender);
    const result = await dialog.showOpenDialog(parentWindow, {
        properties: ['openDirectory']
    });
    return result.canceled ? null : result.filePaths[0];
});

function downloadSong(url, folder, mediaType, format, isPlaylist) {
    const ytDlpPath = path.join(__dirname, 'resources', 'yt-dlp');
    const outputTemplate = path.join(folder, '%(playlist_index)s - %(title)s.%(ext)s');

    let args = ['-o', outputTemplate, '--ffmpeg-location', ffmpegPath, url];

    if (mediaType === 'audio') {
        args.push('-x', '--audio-format', format);
    } else if (mediaType === 'video') {
        args.push('-f', 'bestvideo+bestaudio/best'); // Best video+audio format
        args.push('--merge-output-format', format);  // Merge to desired container
        args.push('--recode-video', format);         // Re-encode video to ensure format
    } else {
        return Promise.reject(new Error('Invalid media type'));
    }

    if (isPlaylist) {
        args.push('--yes-playlist');
    } else {
        args.push('--no-playlist');
    }

    return new Promise((resolve, reject) => {
        const child = spawn(ytDlpPath, args);

        child.stdout.on('data', (data) => console.log(`yt-dlp stdout: ${data.toString()}`));
        child.stderr.on('data', (data) => console.error(`yt-dlp stderr: ${data.toString()}`));

        child.on('close', (code) => {
            if (code === 0) resolve('Download complete!');
            else reject(new Error(`Download failed with exit code ${code}`));
        });

        child.on('error', (err) => reject(err));
    });
}

ipcMain.handle('download-song', async (_event, url, folder, mediaType, format, isPlaylist) => {
    if (!url || !folder || !mediaType || !format) {
        throw new Error('URL, folder, media type, and format are all required');
    }
    return await downloadSong(url, folder, mediaType, format, isPlaylist);
});
