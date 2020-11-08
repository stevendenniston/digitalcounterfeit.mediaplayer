import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  constructor(public dialog: MatDialog) { }  

  public openUploadDialog(): void {
    this.dialog.open(UploadDialogComponent, { width: "50%", height: "50%" });
  }

}
