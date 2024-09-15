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
  route: ActivatedRoute;
  router: Router;

  navigationLinks = ["chatbots"];
  heading = "Chatbot Settings";

  goBackOneLevel = goBackOneLevel;
  onClickBack = onClickBack;

  constructor(
    private chatbotService: ChatbotService,
    private injector: Injector,
    private dialog: MatDialog // Inject Angular Material Dialog
  ) {
    this.route = injector.get<ActivatedRoute>(ActivatedRoute);
    this.router = injector.get<Router>(Router);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chatbotName = params.get('chatbot_name') || '';
      this.isEditMode = !!this.chatbotName;

      if (this.isEditMode) {
        this.loadChatbotData(this.chatbotName);
      }
    });
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const selectedFiles: FileList = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (['txt', 'md', 'pdf'].includes(fileExtension || '') && file.size <= 10 * 1024 * 1024) {
        this.chatbotData.files.push(file);
      } else {
        alert('Invalid file format or file is too large. Please upload .txt, .md, or .pdf files under 10MB.');
      }
    }
  }

  // Open the file viewer in a dialog
  viewFile(fileName: string): void {
    this.dialog.open(FileViewerComponent, {
      width: '600px',
      data: {
        chatbotName: this.chatbotData.name,
        fileName: fileName
      }
    });
  }

  navigateBack() {
    this.router.navigate(['chatbots']);
  }

  loadChatbotData(chatbotName: string): void {
    this.chatbotService.getSingleChatbot(chatbotName).subscribe((singleChatbot: any) => {
      this.chatbotData = singleChatbot;
  
      // Sort files alphabetically and numerically
      this.chatbotData.files.sort(this.sortFiles);
    });
  }
  
  // Custom sorting function for both alphabetical and numeric sorting
  sortFiles(fileA: string, fileB: string): number {
    const regExpAlphaNum = /(\d+|\D+)/g;
  
    // Use match and provide fallback for null
    const fileAArray = fileA.match(regExpAlphaNum) || [];
    const fileBArray = fileB.match(regExpAlphaNum) || [];
  
    // Compare parts
    for (let i = 0; i < Math.max(fileAArray.length, fileBArray.length); i++) {
      const partA = fileAArray[i] || "";
      const partB = fileBArray[i] || "";
  
      const isNumericA = !isNaN(partA as any);
      const isNumericB = !isNaN(partB as any);
  
      if (isNumericA && isNumericB) {
        // Compare numeric parts as numbers
        const numA = parseInt(partA, 10);
        const numB = parseInt(partB, 10);
  
        if (numA !== numB) {
          return numA - numB;
        }
      } else {
        // Compare alphabetic parts as strings
        if (partA !== partB) {
          return partA.localeCompare(partB);
        }
      }
    }
  
    return 0;
  }

  saveChatbot(): void {
    if (this.isEditMode) {
      this.chatbotService.updateChatbot(this.chatbotData).subscribe(() => {
        this.router.navigate(['/chatbots']);
      });
    } else {
      // Adjust the form field mappings for POST
      const postData = {
        name: this.chatbotData.name, // chatbot_title in POST
        instruction: this.chatbotData.instruction, // answerMethod in POST
        status: this.chatbotData.status,
        description: this.chatbotData.description,
        files: this.chatbotData.files
      };

      this.chatbotService.addChatbot(postData).subscribe(() => {
        this.router.navigate(['/chatbots']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/chatbots']);
  }

  // Delete file with filename
  deleteFile(fileName: string): void {
    const chatbotName = this.chatbotData.name;
    this.chatbotService.deleteFile(chatbotName, fileName).subscribe(() => {
      // Remove the file from the chatbotData once deleted
      this.chatbotData.files = this.chatbotData.files.filter((file: string) => file !== fileName);
    });
  }
}
