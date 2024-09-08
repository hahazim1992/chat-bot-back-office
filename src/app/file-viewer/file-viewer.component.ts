import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; // Import MAT_DIALOG_DATA
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

  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject data passed via dialog
  ) {
    this.chatbotName = data.chatbotName;
    this.fileName = data.fileName;
  }

  ngOnInit(): void {
    // Fetch file content by calling the API
    this.loadFileContent();
  }

  loadFileContent(): void {
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
}
