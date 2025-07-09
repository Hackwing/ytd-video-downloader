const { ipcRenderer } = require('electron');

document.getElementById('downloadBtn').addEventListener('click', () => {
    const url = document.getElementById('url').value;
    const format = document.getElementById('format').value;
    const downloadPath = document.getElementById('downloadPath').value;

    if (!url || !format || !downloadPath) {
        appendOutput("❌ Please fill in all fields.");
        return;
    }

    document.getElementById('progressBar').value = 0;
    ipcRenderer.send('run-script', { url, format, downloadPath });
});

ipcRenderer.on('script-output', (event, message) => {
    appendOutput(message);
});

ipcRenderer.on('download-progress', (event, progress) => {
    document.getElementById('progressBar').value = progress;
    document.getElementById('progressPercent').innerText = `${progress.toFixed(1)}%`;
});

function appendOutput(message) {
    const output = document.getElementById('output');
    output.value += message + "\n";
    output.scrollTop = output.scrollHeight;
}
