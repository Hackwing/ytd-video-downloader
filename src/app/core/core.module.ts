import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YtdDownloaderComponent } from './ytd-downloader/ytd-downloader.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    YtdDownloaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class CoreModule { }
