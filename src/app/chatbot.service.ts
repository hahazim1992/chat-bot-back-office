import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private chatBotsUrl = 'http://127.0.0.1:8000/chatbots'; // Base URL for chatbots
  private baseUrl = 'http://127.0.0.1:8000'; // Base URL for delete file
  private createChatbotUrl = 'http://127.0.0.1:8000/create-chatbot'; // URL for POST

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

  // Add a new chatbot (POST)
  addChatbot(chatbot: any): Observable<any> {
    const formData = new FormData();
    formData.append('chatbot_title', chatbot.title);
    formData.append('chatbot_name', chatbot.name);
    formData.append('answerMethod', chatbot.instruction);
    formData.append('status', chatbot.status);
    formData.append('description', chatbot.description);

    // Append each file in the array
    chatbot.files.forEach((file: File) => {
      formData.append('files', file);
    });

    return this.http.post<any>(this.createChatbotUrl, formData);
  }

  // Update an existing chatbot
  updateChatbot(chatbot: any): Observable<any> {
    const url = `${this.baseUrl}/${chatbot.name}/save`;
    const formData = new FormData();
    formData.append('chatbot_title', chatbot.title);
    formData.append('chatbot_name', chatbot.name);
    formData.append('answerMethod', chatbot.instruction);
    formData.append('status', chatbot.status);
    formData.append('description', chatbot.description);

    // Append each file in the array
    chatbot.files.forEach((file: File) => {
      formData.append('files', file);
    });

    return this.http.put<any>(url, formData);
  }

  // Delete a file from chatbot
  deleteFile(chatbotName: string, fileName: string): Observable<any> {
    const url = `${this.baseUrl}/${chatbotName}/delete-file`;
    const body = { filename: fileName }; // Send filename in the body
    return this.http.request<any>('delete', url, { body });
  }

  // Fetch file content from server (markdown, text, etc.)
  getFileContent(chatbotName: string, fileName: string): Observable<string> {
    const url = `http://127.0.0.1:8000/${chatbotName}/file/${fileName}`;
    return this.http.get(url, { responseType: 'text' });
  }
}
