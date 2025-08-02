import { Component } from '@angular/core';

@Component({
  selector: 'app-ytd-downloader',
  templateUrl: './ytd-downloader.component.html',
  styleUrls: ['./ytd-downloader.component.scss']
})
export class YtdDownloaderComponent {

  youtubeUrl = '';
  folderPath = '';
  format: 'mp3' | 'mp4' = 'mp3';  // default format
  message = '';
  progressBarVisible = false;

  async chooseFolder() {
    const selected = await (window as any).electronAPI.chooseFolder();
    if (selected) this.folderPath = selected;
  }

  async onDownload() {
    if (!this.youtubeUrl || !this.folderPath || !this.format) {
      this.message = 'Please enter URL, select folder, and choose format.';
      return;
    }
    this.progressBarVisible = true;
    this.message = '';
    try {
      const result = await (window as any).electronAPI.downloadSong(this.youtubeUrl, this.folderPath, this.format);
      this.message = result;
    } catch (err: any) {
      this.message = `Error: ${err.message || err}`;
    } finally {
      this.progressBarVisible = false;
    }
  }

}
