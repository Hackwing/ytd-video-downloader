const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// 📦 IPC Listener: Receives params from renderer
ipcMain.on('run-script', (event, args) => {
    // 📍 Locate PS script from unpacked directory (via extraFiles)
    // const psScriptPath = path.join(path.dirname(process.execPath), 'download_video.ps1');
    const psScriptPath = path.join(__dirname, 'download_video.ps1');

    // ❗ Check if script exists
    if (!fs.existsSync(psScriptPath)) {
        event.reply('script-output', `ERROR: Cannot find script at ${psScriptPath}`);
        return;
    }

    // 🧠 PowerShell args
    const ps = spawn('powershell.exe', [
        '-ExecutionPolicy', 'Bypass',
        '-File', psScriptPath,
        '-url', args.url,
        '-format', args.format,
        '-downloadPath', args.downloadPath
    ]);

    let buffer = '';

    // 📤 Handle stdout
    ps.stdout.on('data', (data) => {
        buffer += data.toString();
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop(); // hold incomplete line

        lines.forEach(line => {
            event.reply('script-output', line);

            const match = line.match(/download:(\d{1,3}\.\d)/);
            if (match) {
                const progress = parseFloat(match[1]);
                event.reply('download-progress', progress);
            }
        });
    });

    // ⚠️ Handle stderr
    ps.stderr.on('data', (data) => {
        event.reply('script-output', `ERROR: ${data.toString()}`);
    });

    // ✅ Final result
    ps.on('exit', (code) => {
        if (code === 0) {
            event.reply('script-output', `Script finished successfully.`);
        } else {
            event.reply('script-output', `Script exited with code ${code}`);
        }
        event.reply('download-progress', 100);
    });
});
