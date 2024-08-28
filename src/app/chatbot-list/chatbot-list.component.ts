import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../chatbot.service'; 

@Component({
  selector: 'app-chatbot-list',
  templateUrl: './chatbot-list.component.html',
  styleUrls: ['./chatbot-list.component.scss']
})
export class ChatbotListComponent implements OnInit {
  chatbots: any[] = [];

  constructor(private chatbotService: ChatbotService) {}

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
