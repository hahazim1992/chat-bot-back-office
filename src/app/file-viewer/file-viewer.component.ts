import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // For sanitizing HTML content
import { marked } from 'marked'; // Use marked.js for markdown rendering
import { ChatbotService } from '../chatbot.service';// Import ChatbotService

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss']
})
export class FileViewerComponent implements OnInit {
  chatbotName: string;
  fileName: string;
  fileContent: string | SafeHtml = '';  // Can hold either plain text or sanitized HTML
  fileType: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer, // Inject the DomSanitizer for sanitizing HTML
    private chatbotService: ChatbotService // Inject the ChatbotService
  ) {
    this.chatbotName = data.chatbotName;
    this.fileName = data.fileName;
  }

  ngOnInit(): void {
    if (this.data.fileContent) {
      // If file content is passed directly (newly selected file), use it
      this.fileContent = this.data.fileContent;
      this.fileType = this.data.fileType;
    } else {
      // Otherwise, load the file from the server (edit mode)
      this.fileType = this.getFileType(this.fileName);
      if (this.fileType === 'text') {
        this.loadTextFile();
      } else if (this.fileType === 'markdown') {
        this.loadMarkdownFile();
      } else if (this.fileType === 'pdf') {
        this.loadPdfFile();
      } else if (this.fileType === 'image') {
        this.loadImageFile();
      }
    }
  }
  

  // Detect the file type based on file extension
  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    if (['txt'].includes(extension)) {
      return 'text';
    } else if (['md'].includes(extension)) {
      return 'markdown';  // Detect markdown files
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'image';
    }
    return 'unknown';
  }

  async loadMarkdownFile(): Promise<void> {
    this.chatbotService.getFileContent(this.chatbotName, this.fileName).subscribe(
      async (data: string) => {
        const markdownContent: string = await marked(data); // Convert markdown to HTML asynchronously
        this.fileContent = this.sanitizer.bypassSecurityTrustHtml(markdownContent); // Sanitize and assign HTML
      },
      error => {
        console.error('Error loading markdown content:', error);
      }
    );
  }

  // Load a text file
  loadTextFile(): void {
    this.chatbotService.getFileContent(this.chatbotName, this.fileName).subscribe(
      (data: string) => {
        this.fileContent = data;
      },
      error => {
        console.error('Error loading text content:', error);
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

  ngOnDestroy(): void {
    // Revoke the object URL if it was created for newly selected files
    if (typeof this.fileContent === 'string' && this.fileType !== 'server') {
      URL.revokeObjectURL(this.fileContent);
    }
  }
}
