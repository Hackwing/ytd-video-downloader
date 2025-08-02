// main.js (Electron main process full)
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static'); // npm package for cross-platform ffmpeg

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
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

function downloadSong(url, folder, format) {
    const ytDlpPath = path.join(__dirname, 'resources', 'yt-dlp');
    const outputTemplate = path.join(folder, '%(title)s.%(ext)s');

    let args = [url, '-o', outputTemplate, '--ffmpeg-location', ffmpegPath];

    if (format === 'mp3') {
        args.push('-x', '--audio-format', 'mp3');
    } else if (format === 'mp4') {
        args.push('-f', '22/bestvideo+bestaudio/best');
    } else {
        return Promise.reject(new Error('Invalid format selected'));
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

ipcMain.handle('download-song', async (_event, url, folder, format) => {
    if (!url || !folder || !format) {
        throw new Error('URL, folder path, and format are required');
    }
    return await downloadSong(url, folder, format);
});
