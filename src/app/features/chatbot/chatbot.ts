import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../core/services/chatbot.service';
import { ViewChild, ElementRef } from '@angular/core';


interface MensajeChat {
  texto: string;
  tipo: 'usuario' | 'bot';
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css']
})
export class ChatbotComponent {

  abierto = false;
  cargando = false;
  mensaje = '';
  @ViewChild('chatContainer') chatContainer!: ElementRef;


  mensajes: MensajeChat[] = [
    {
      texto: 'Hola, soy el asistente de Mar y Mar. ¿En qué puedo ayudarte?',
      tipo: 'bot'
    }
  ];

  constructor(private chatbotService: ChatbotService) {}

  toggleChat() {
    this.abierto = !this.abierto;
  }

  enviarMensaje() {
    const texto = this.mensaje.trim();

    if (!texto || this.cargando) return;

    this.mensajes.push({
      texto,
      tipo: 'usuario'
    });
    this.scrollToBottom();
    this.mensaje = '';
    this.cargando = true;

this.chatbotService.enviarMensaje(texto).subscribe({
  next: (res) => {
    this.mensajes.push({
      texto: res.respuesta,
      tipo: 'bot'
    });
    this.cargando = false;
    this.scrollToBottom();
  },
  error: (err) => {
    console.error(err);
    this.mensajes.push({
      texto: 'Ocurrió un error al responder.',
      tipo: 'bot'
    });
    this.cargando = false;
  }
});
  }
  scrollToBottom() {
  setTimeout(() => {
    this.chatContainer.nativeElement.scrollTop =
      this.chatContainer.nativeElement.scrollHeight;
  }, 100);
}
}