import { Component } from '@angular/core';

@Component({
  selector: 'app-ytd-downloader',
  templateUrl: './ytd-downloader.component.html',
  styleUrls: ['./ytd-downloader.component.scss']
})
export class YtdDownloaderComponent {

  youtubeUrl = '';
  folderPath = '';
  mediaType: 'audio' | 'video' = 'audio';
  audioFormats = ['mp3', 'wav', 'aac', 'flac'];
  videoFormats = ['mp4', 'mkv', 'webm'];
  selectedFormat = '';
  isPlaylist = false;
  message = '';
  progressBarVisible = false;

  get availableFormats() {
    return this.mediaType === 'audio' ? this.audioFormats : this.videoFormats;
  }

  async chooseFolder() {
    const selected = await (window as any).electronAPI.chooseFolder();
    if (selected) this.folderPath = selected;
  }

  async onDownload() {
    if (!this.youtubeUrl || !this.folderPath || !this.selectedFormat) {
      this.message = 'Please fill all fields and select format.';
      return;
    }
    this.progressBarVisible = true;
    this.message = '';
    try {
      const result = await (window as any).electronAPI.downloadSong(
        this.youtubeUrl,
        this.folderPath,
        this.mediaType,
        this.selectedFormat,
        this.isPlaylist
      );
      this.message = result;
    } catch (err: any) {
      this.message = `Error: ${err.message || err}`;
    } finally {
      this.progressBarVisible = false;
    }
  }
}