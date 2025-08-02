import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YtdDownloaderComponent } from './ytd-downloader.component';

describe('YtdDownloaderComponent', () => {
  let component: YtdDownloaderComponent;
  let fixture: ComponentFixture<YtdDownloaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YtdDownloaderComponent]
    });
    fixture = TestBed.createComponent(YtdDownloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
