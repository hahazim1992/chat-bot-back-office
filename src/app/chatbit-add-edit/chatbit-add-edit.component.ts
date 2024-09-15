import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatbotService } from '../chatbot.service'; 
import { goBackOneLevel, onClickBack } from '../navigation/navigationHelper';
import { MatDialog } from '@angular/material/dialog'; // If using Angular Material dialog
import { FileViewerComponent } from '../file-viewer/file-viewer.component';

@Component({
  selector: 'app-chatbot-add-edit',
  templateUrl: './chatbit-add-edit.component.html',
  styleUrls: ['./chatbit-add-edit.component.scss']
})
export class ChatbitAddEditComponent implements OnInit {
  chatbotName: string = '';
  isEditMode: boolean = false;
  chatbotData: any = {
    name: '',
    title: '',
    description: '',
    instruction: '',
    status: 'inactive',
    files: []
  };
  saveLabel = "";
  route: ActivatedRoute;
  router: Router;

  navigationLinks = ["chatbots"];
  heading = "Chatbot Settings";

  goBackOneLevel = goBackOneLevel;
  onClickBack = onClickBack;

  newFiles: File[] = [];

  constructor(
    private chatbotService: ChatbotService,
    private injector: Injector,
    private dialog: MatDialog
  ) {
    this.route = injector.get<ActivatedRoute>(ActivatedRoute);
    this.router = injector.get<Router>(Router);
  }

  ngOnInit(): void {
    const chatbotName = this.route.snapshot.paramMap.get('chatbot_name');
    if (chatbotName) {
      this.isEditMode = true;
      this.saveLabel = "Edit";
      this.loadChatbotData(chatbotName);
    } else {
      this.isEditMode = false;
      this.saveLabel = "Save";
    }
  }

  // Handle file selection for "add" mode
  onFileSelected(event: any): void {
    const selectedFiles: FileList = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (['txt', 'md', 'pdf'].includes(fileExtension || '') && file.size <= 10 * 1024 * 1024) {
        this.newFiles.push(file);
      } else {
        alert('Invalid file format or file is too large. Please upload .txt, .md, or .pdf files under 10MB.');
      }
    }
  }

  // Get the file list based on mode
  getFileList(): string[] {
    if (this.isEditMode) {
      // In edit mode, show files from the server
      return [...this.chatbotData.files];
    } else {
      // In add mode, show newly selected files
      return [...this.newFiles.map(file => file.name)];
    }
  }

  // View file based on add or edit mode
  viewFile(fileName: string): void {
    if (this.isEditMode) {
      // In edit mode, handle viewing files from the server (already uploaded)
      this.dialog.open(FileViewerComponent, {
        width: '600px',
        data: { chatbotName: this.chatbotData.name, fileName }
      });
    } else {
      // In add mode, view the file without base64 encoding
      const newFile = this.newFiles.find(file => file.name === fileName);
      if (newFile) {
        const fileURL = URL.createObjectURL(newFile); // Create a URL for the file
        const fileType = this.getFileType(fileName);

        // Open the file in the viewer component
        this.dialog.open(FileViewerComponent, {
          width: '600px',
          data: { fileName, fileContent: fileURL, fileType }
        });
      }
    }
  }

  // Helper function to get file type from extension
  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'txt': return 'text';
      case 'md': return 'markdown';
      case 'pdf': return 'pdf';
      default: return 'unknown';
    }
  }
  navigateBack() {
    this.router.navigate(['chatbots']);
  }

  // Load chatbot data for edit mode
  loadChatbotData(chatbotName: string): void {
    this.chatbotService.getSingleChatbot(chatbotName).subscribe((singleChatbot: any) => {
      this.chatbotData = singleChatbot;
      // Sort files alphabetically and numerically
      this.chatbotData.files.sort(this.sortFiles);
    });
  }

  // Sort files alphabetically and numerically
  sortFiles(fileA: string, fileB: string): number {
    const regExpAlphaNum = /(\d+|\D+)/g;
    const fileAArray = fileA.match(regExpAlphaNum) || [];
    const fileBArray = fileB.match(regExpAlphaNum) || [];
    
    for (let i = 0; i < Math.max(fileAArray.length, fileBArray.length); i++) {
      const partA = fileAArray[i] || "";
      const partB = fileBArray[i] || "";
      const isNumericA = !isNaN(partA as any);
      const isNumericB = !isNaN(partB as any);

      if (isNumericA && isNumericB) {
        const numA = parseInt(partA, 10);
        const numB = parseInt(partB, 10);
        if (numA !== numB) {
          return numA - numB;
        }
      } else {
        if (partA !== partB) {
          return partA.localeCompare(partB);
        }
      }
    }
    return 0;
  }

  // Save chatbot data (add or edit mode)
  saveChatbot(): void {
    
    if (this.isEditMode) {
      // Handle edit (PUT)
      const postData = {
        name: this.chatbotData.name,
        instruction: this.chatbotData.instruction,
        status: this.chatbotData.status,
        description: this.chatbotData.description,
        files: this.newFiles
      };
      this.chatbotService.updateChatbot(postData).subscribe(() => {
        this.router.navigate(['/chatbots']);
      });
    } else {
      // Handle add (POST)
      const postData = {
        name: this.chatbotData.name,
        instruction: this.chatbotData.instruction,
        status: this.chatbotData.status,
        description: this.chatbotData.description,
        files: this.newFiles
      };

      this.chatbotService.addChatbot(postData).subscribe(() => {
        this.router.navigate(['/chatbots']);
      });
    }
  }

  // Delete file with filename
  deleteFile(fileName: string): void {
    if (this.isEditMode) {
      const chatbotName = this.chatbotData.name;
      this.chatbotService.deleteFile(chatbotName, fileName).subscribe(() => {
        this.chatbotData.files = this.chatbotData.files.filter((file: string) => file !== fileName);
      });
    } else {
      // In add mode, remove file from the newFiles array
      this.newFiles = this.newFiles.filter(file => file.name !== fileName);
    }
  }

  triggerFileUpload(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
