import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'https://your-api-endpoint.com/api/chatbots'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getChatbots(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addChatbot(chatbot: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, chatbot);
  }
}
