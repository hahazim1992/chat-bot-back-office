import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-chat-ui',
  templateUrl: './chat-ui.component.html',
  styleUrls: ['./chat-ui.component.scss'],
})
export class ChatUIComponent implements OnInit {
  sessionId: string | null = null;
  messages: Array<{ text: string; sender: string }> = [];
  inputMessage: string = '';
  chatbotName: string | null = '';
  isLoading: boolean = false; // Loader state

  @ViewChild('chatMessages') chatMessagesContainer!: ElementRef;

  constructor(private http: HttpClient, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.chatbotName = this.route.snapshot.paramMap.get('chatbot_name');
    this.startChatSession();
  }

  startChatSession(): void {
    if (!this.chatbotName) {
      console.error('Chatbot name not found!');
      return;
    }

    this.http.get(`http://localhost:8000/start-session/${this.chatbotName}`).subscribe({
      next: (response: any) => (this.sessionId = response),
      error: (err) => console.error('Error starting chat session:', err),
    });
  }

  sendMessage(): void {
    if (!this.inputMessage.trim() || !this.sessionId || this.isLoading) {
      console.log('Send button clicked but there is nothing to send or chatbot is busy');
      return;
    }
  
    const newMessage = { text: this.inputMessage, sender: 'user' };
    this.messages.push(newMessage);
    this.inputMessage = '';
  
    // Scroll to the bottom after user sends message
    this.scrollToBottom();
  
    // Disable input and show loader while waiting for chatbot's response
    this.isLoading = true;
  
    this.http
      .post(`http://localhost:8000/chat/${this.chatbotName}`, {
        query: newMessage.text,
        session_id: this.sessionId,
      })
      .subscribe({
        next: (response: any) => {
          const botMessage = { text: response.answer, sender: 'bot' };
          this.messages.push(botMessage);
          this.isLoading = false; // Re-enable input and hide loader after response
  
          // Scroll to the bottom after receiving bot response
          this.scrollToBottom();
        },
        error: (err) => {
          console.error('Error sending message:', err);
          this.isLoading = false; // Re-enable input on error
        },
      });
  }

  scrollToBottom(): void {
    try {
      this.cdr.detectChanges(); // Ensure the view is updated before scrolling
      setTimeout(() => {
        this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
      }, 0); // Timeout allows DOM to fully render
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
