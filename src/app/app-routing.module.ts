import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YtdDownloaderComponent } from './core/ytd-downloader/ytd-downloader.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: YtdDownloaderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
