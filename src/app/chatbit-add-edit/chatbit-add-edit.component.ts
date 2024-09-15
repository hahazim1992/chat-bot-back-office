import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatbotService } from '../chatbot.service'; 
import { goBackOneLevel, onClickBack } from '../navigation/navigationHelper';
import { MatDialog } from '@angular/material/dialog'; // If using Angular Material dialog
import { FileViewerComponent } from '../file-viewer/file-viewer.component';
import { marked } from 'marked';
import { NgxSpinnerService } from 'ngx-spinner';

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
  errorMessage: string | null = null; // Initialize error message variable

  goBackOneLevel = goBackOneLevel;
  onClickBack = onClickBack;

  newFiles: File[] = [];

  isLoading: boolean = false;

  constructor(
    private chatbotService: ChatbotService,
    private injector: Injector,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
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
      // In edit mode, combine server files and newly selected files
      return [
        ...this.chatbotData.files,         // Existing files from the server
        ...this.newFiles.map(file => file.name) // Newly selected files
      ];
    } else {
      // In add mode, only show newly selected files
      return this.newFiles.map(file => file.name);
    }
  }
  

  // View file based on add or edit mode
  viewFile(fileName: string): void {
    if (this.isEditMode && !this.newFiles.some(file => file.name === fileName)) {
      // Handle files from the server (already uploaded)
      this.dialog.open(FileViewerComponent, {
        width: '600px',
        data: { chatbotName: this.chatbotData.name, fileName }
      });
    } else {
      // Handle newly selected files (not yet uploaded)
      const newFile = this.newFiles.find(file => file.name === fileName);
      if (newFile) {
        const fileType = this.getFileType(newFile.name);
  
        if (fileType === 'text' || fileType === 'markdown') {
          // Use FileReader to read text or markdown file
          const reader = new FileReader();
          reader.onload = (e: any) => {
            let fileContent = e.target.result;
            if (fileType === 'markdown') {
              // Convert markdown to HTML
              fileContent = marked(fileContent);
            }
            this.dialog.open(FileViewerComponent, {
              width: '600px',
              data: { fileName: newFile.name, fileContent, fileType }
            });
          };
          reader.readAsText(newFile);
        } else {
          // For PDFs and images, use createObjectURL to display
          const fileContent = URL.createObjectURL(newFile);
          this.dialog.open(FileViewerComponent, {
            width: '600px',
            data: { fileName: newFile.name, fileContent, fileType }
          });
        }
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
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'image';
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
    this.isLoading = true; // Set loading to true
    this.spinner.show(); // Show the spinner

    // Check if in edit mode and if there are no new files
    if (this.newFiles.length === 0) {
        this.spinner.hide(); // Hide the spinner
        this.isLoading = false; // Set loading to false
        alert('At least one new file needs to be uploaded for editing.'); // Show error message
        return; // Exit the function
    }

    const postData = {
        name: this.chatbotData.name,
        instruction: this.chatbotData.instruction,
        status: this.chatbotData.status,
        description: this.chatbotData.description,
        files: this.newFiles
    };

    const apiCall = this.isEditMode 
        ? this.chatbotService.updateChatbot(postData) 
        : this.chatbotService.addChatbot(postData);

    apiCall.subscribe(() => {
        this.spinner.hide(); // Hide the spinner after the API call is complete
        this.isLoading = false; // Set loading to false
        this.router.navigate(['/chatbots']);
    }, error => {
        this.spinner.hide(); // Hide the spinner if there is an error
        this.isLoading = false; // Set loading to false
        // Handle error
    });
}
  

  // Delete file with filename
  deleteFile(fileName: string): void {
    if (this.isEditMode) {
      // Check if the file exists in the server files
      const existingFileIndex = this.chatbotData.files.indexOf(fileName);
      
      if (existingFileIndex !== -1) {
        // If the file exists on the server, call the API to delete it
        const chatbotName = this.chatbotData.name;
        this.chatbotService.deleteFile(chatbotName, fileName).subscribe(() => {
          // Remove the file from the chatbotData.files array
          this.chatbotData.files.splice(existingFileIndex, 1);
          // Reset the newFiles array as the file was deleted
          this.newFiles = this.newFiles.filter(file => file.name !== fileName);
          // Reset the file input field
          this.resetFileInput();
        });
      } else {
        // If the file is not from the server, remove it from the newly selected files (newFiles)
        this.newFiles = this.newFiles.filter(file => file.name !== fileName);
        // Reset the file input field
        this.resetFileInput();
      }
    } else {
      // In add mode, just remove the file from the newFiles array
      this.newFiles = this.newFiles.filter(file => file.name !== fileName);
      // Reset the file input field
      this.resetFileInput();
    }
  }

  // Reset the file input
  resetFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the input value
    }
  }
  

  triggerFileUpload(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  isFormValid(): boolean {
    return this.chatbotData.name.trim() !== ''; // Check if chatbot name is not empty
  }
  
  isNewFile(fileName: string): boolean {
    return this.newFiles.some(file => file.name === fileName);
  }
}
