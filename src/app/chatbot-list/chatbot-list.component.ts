import { Component, OnInit, Injector } from '@angular/core';
import { ChatbotService } from '../chatbot.service'; 
import { goBackOneLevel, onClickBack } from '../navigation/navigationHelper';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-chatbot-list',
  templateUrl: './chatbot-list.component.html',
  styleUrls: ['./chatbot-list.component.scss']
})
export class ChatbotListComponent implements OnInit {
  chatbots: any[] = [];
  navigationLinks = ["chatbots"];
  heading = "My Chatbots";
  route: ActivatedRoute;
  router: Router;

  goBackOneLevel = goBackOneLevel;
  onClickBack = onClickBack;

  constructor(private injector: Injector, private chatbotService: ChatbotService) {
    this.route = injector.get<ActivatedRoute>(ActivatedRoute);
    this.router = injector.get<Router>(Router);
  }

  ngOnInit(): void {
    this.getChatbots();
  }

  getChatbots(): void {
    this.chatbotService.getChatbots().subscribe((data: any[]) => {
      this.chatbots = data;
    });
  }

  addNewChatbot(): void {
    this.chatbotService.addChatbot({ name: 'New Chatbot', active: false }).subscribe(() => {
      this.getChatbots(); // Refresh the list after adding
    });
  }

  onChatbotClick(chatbot: any): void {
    // Navigate to the chatbot detail page
    // You can use Angular's Router to navigate
    console.log('Redirecting to:', chatbot.name);
  }
}
