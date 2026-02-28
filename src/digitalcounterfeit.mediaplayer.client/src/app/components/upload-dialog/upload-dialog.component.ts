import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { forkJoin, Observable } from "rxjs";
import { AudioTrackService } from "src/app/services/audio-track.service";

@Component({
  selector: "app-upload-dialog",
  templateUrl: "./upload-dialog.component.html",
  styleUrls: ["./upload-dialog.component.scss"]
})
export class UploadDialogComponent implements OnInit {

  @ViewChild("file", { static: false }) file;

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
    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        this.files.add(files[key]);
      }
    }
  }

  closeDialog(): void {
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    this.audioTrackService.UploadStatus
        .subscribe(status => {
          if (status){
            const progressObservables = [];

            for (const key of Object.keys(status)) {
              progressObservables.push(status[key].progress);
            }

            this.primaryButtonText = "Finish";
            this.canBeClosed = false;
            this.dialogRef.disableClose = true;
            this.showCancelButton = false;
            this.uploading = true;

            forkJoin(progressObservables)
              .subscribe(event => {
                // console.log(event);
              }, error => {
                console.log(error);
              }, () => {                
                this.canBeClosed = true;
                this.dialogRef.disableClose = false;
                this.uploadSuccessful = true;
                this.uploading = false;
              });
          }
        });

    this.audioTrackService.UploadAudioTrackFiles(this.files);
  }
}
