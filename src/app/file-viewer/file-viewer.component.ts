import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked'; // Import marked.js for markdown rendering
import { ChatbotService } from '../chatbot.service';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss']
})
export class FileViewerComponent implements OnInit {
  chatbotName: string;
  fileName: string;
  fileContent: string | SafeHtml = '';
  fileType: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private chatbotService: ChatbotService
  ) {
    this.chatbotName = data.chatbotName;
    this.fileName = data.fileName;
  }

  async ngOnInit(): Promise<void> {
    if (this.data.fileContent) {
      // If file content is passed directly (newly selected file), use it
      this.fileType = this.data.fileType;
      if (this.fileType === 'markdown') {
        // Await the result of marked if it's asynchronous
        const markdownHtml = await this.renderMarkdown(this.data.fileContent);
        this.fileContent = this.sanitizer.bypassSecurityTrustHtml(markdownHtml);
      } else {
        this.fileContent = this.data.fileContent;
      }
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

  // Function to detect the file type based on the file extension
  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    if (['txt'].includes(extension)) {
      return 'text';
    } else if (['md'].includes(extension)) {
      return 'markdown';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'image';
    }
    return 'unknown';
  }

    // Load a markdown file from the server
    loadMarkdownFile(): void {
      this.chatbotService.getFileContent(this.chatbotName, this.fileName).subscribe(
        async (data: string) => {
          const markdownHtml = await this.renderMarkdown(data);
          this.fileContent = this.sanitizer.bypassSecurityTrustHtml(markdownHtml); // Sanitize and assign HTML
        },
        error => {
          console.error('Error loading markdown content:', error);
        }
      );
    }

  // Load a text file from the server
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

  // Load a PDF file from the server (display in iframe/embed)
  loadPdfFile(): void {
    const apiUrl = `http://127.0.0.1:8000/${this.chatbotName}/file/${this.fileName}`;
    this.fileContent = this.sanitizer.bypassSecurityTrustResourceUrl(apiUrl); // Sanitize the URL
  }

  // Load an image file from the server
  loadImageFile(): void {
    const apiUrl = `http://127.0.0.1:8000/${this.chatbotName}/file/${this.fileName}`;
    this.fileContent = apiUrl; // Use the URL to load the image
  }

  // Render markdown to HTML, handling both promise-based and synchronous returns
  async renderMarkdown(markdown: string): Promise<string> {
    const result = marked(markdown);
    if (result instanceof Promise) {
      return await result;
    }
    return result;
  }
}
