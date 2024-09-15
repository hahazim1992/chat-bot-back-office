import { Component, OnInit, Injector } from '@angular/core';
import { ChatbotService } from '../chatbot.service'; 
import { Router, ActivatedRoute } from "@angular/router";

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

  navigateToEdit(chatbotName: string): void {
    this.router.navigate(['/chatbots/edit', chatbotName]);
  }

  navigateToAdd(): void {
    this.router.navigate(['/chatbots/add']);
  }
}
