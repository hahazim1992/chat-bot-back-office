import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatbotService } from '../chatbot.service'; 
import { goBackOneLevel, onClickBack } from '../navigation/navigationHelper';

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
    description: '',
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
    private injector: Injector
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

  navigateBack() {
    this.router.navigate(['chatbots']);
  }

  loadChatbotData(chatbotName: string): void {
    this.chatbotService.getSingleChatbot(chatbotName).subscribe((singleChatbot: any) => {
      this.chatbotData = singleChatbot;
    });
  }

  saveChatbot(): void {
    if (this.isEditMode) {
      this.chatbotService.updateChatbot(this.chatbotData).subscribe(() => {
        this.router.navigate(['/chatbots']);
      });
    } else {
      this.chatbotService.addChatbot(this.chatbotData).subscribe(() => {
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
