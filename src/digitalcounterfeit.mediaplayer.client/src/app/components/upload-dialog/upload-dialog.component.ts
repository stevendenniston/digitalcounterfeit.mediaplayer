import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { AudioTrackService } from 'src/app/services/audio-track.service';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {

  @ViewChild("file", { static: false }) file

  public files: Set<File> = new Set();

  progress;
  canBeClosed = true;
  primaryButtonText = "Upload";
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>, 
    private audioTrackService: AudioTrackService) { }

  ngOnInit(): void {
  }

  addFiles(): void {
    this.file.nativeElement.click();
  }

  onFilesAdded(): void {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }
    console.log(files);
  }

  closeDialog(): void {
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    this.uploading = true;
    this.progress = this.audioTrackService.UploadAudioTrackFiles(this.files);
    let progressObservables: Observable<number>[] = [];

    for (let key in this.progress) {
      progressObservables.push(this.progress[key].progress);
    }

    this.primaryButtonText = "Finish";
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;
    this.showCancelButton = false;

    forkJoin(progressObservables).subscribe(
      () => {}, 
      () => {}, 
      () => {
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;
      this.uploadSuccessful = true;
      this.uploading = false;
    })
  }
}
