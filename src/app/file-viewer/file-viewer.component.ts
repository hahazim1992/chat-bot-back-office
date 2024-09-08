import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss']
})
export class FileViewerComponent implements OnInit {
  chatbotName: string;
  fileName: string;
  fileContent: string = '';
  fileType: string = '';

  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.chatbotName = data.chatbotName;
    this.fileName = data.fileName;
  }

  ngOnInit(): void {
    this.fileType = this.getFileType(this.fileName);
    if (this.fileType === 'text') {
      this.loadTextFile();
    } else if (this.fileType === 'pdf') {
      this.loadPdfFile();
    } else if (this.fileType === 'image') {
      this.loadImageFile();
    }
  }

  // Detect the file type
  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''; // Default to empty string if undefined
    if (['txt'].includes(extension)) {
      return 'text';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'image';
    }
    return 'unknown';
  }


  // Load a text file
  loadTextFile(): void {
    const apiUrl = `http://127.0.0.1:8000/${this.chatbotName}/file/${this.fileName}`;
    this.http.get(apiUrl, { responseType: 'text' }).subscribe(
      (data: string) => {
        this.fileContent = data;
      },
      error => {
        console.error('Error loading file content:', error);
      }
    );
  }

  // Load a PDF file (display it in an iframe or embed)
  loadPdfFile(): void {
    const apiUrl = `http://127.0.0.1:8000/${this.chatbotName}/file/${this.fileName}`;
    this.fileContent = apiUrl; // Use the URL directly to load the PDF in the view
  }

  // Load an image file
  loadImageFile(): void {
    const apiUrl = `http://127.0.0.1:8000/${this.chatbotName}/file/${this.fileName}`;
    this.fileContent = apiUrl; // Use the URL directly to load the image in the view
  }
}
