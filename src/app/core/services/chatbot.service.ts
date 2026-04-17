import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatRequest {
  mensaje: string;
}

export interface ChatResponse {
  respuesta: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private apiUrl = `${environment.apiUrl}/chatbot`;

  constructor(private http: HttpClient) {}

enviarMensaje(texto: string) {
  return this.http.post<{ respuesta: string }>(`${this.apiUrl}`, {
    mensaje: texto
  });
}
}