import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private chatBotsUrl = 'http://127.0.0.1:50000/chatbots'; // Base URL for chatbots

  constructor(private http: HttpClient) {}

  // Get all chatbots
  getChatbots(): Observable<any[]> {
    return this.http.get<any[]>(this.chatBotsUrl);
  }

  // Get a single chatbot by name
  getSingleChatbot(chatbotName: string): Observable<any> {
    const url = `${this.chatBotsUrl}/${chatbotName}`;
    return this.http.get<any>(url);
  }

  // Add a new chatbot
  addChatbot(chatbot: any): Observable<any> {
    return this.http.post<any>(this.chatBotsUrl, chatbot);
  }

  // Update an existing chatbot
  updateChatbot(chatbot: any): Observable<any> {
    const url = `${this.chatBotsUrl}/${chatbot.name}`;
    return this.http.put<any>(url, chatbot);
  }
}
