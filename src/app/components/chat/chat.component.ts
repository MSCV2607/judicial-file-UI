// src/app/components/chat/chat.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatService } from '../../services/chat.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  usuarios: any[] = [];
  usuarioActualId: number = 0;
  receptorId: number | null = null;
  receptorNombre: string = '';
  mensajes: any[] = [];
  nuevoMensaje: string = '';

  @ViewChild('chatScroll') chatScroll!: ElementRef;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('id');
    this.usuarioActualId = userId ? parseInt(userId, 10) : 0;

    // Si había una conversación activa antes, restaurarla
    const receptorGuardado = localStorage.getItem('receptorId');
    const nombreGuardado = localStorage.getItem('receptorNombre');

    if (receptorGuardado && nombreGuardado) {
      this.receptorId = parseInt(receptorGuardado, 10);
      this.receptorNombre = nombreGuardado;
      this.cargarMensajes();
    }

    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.chatService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data.filter(u => u.id !== this.usuarioActualId);
      },
      error: () => Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error')
    });
  }

  seleccionarReceptor(usuario: any): void {
    if (!usuario || usuario.id == null) return;

    this.receptorId = usuario.id;
    this.receptorNombre = usuario.nombreCompleto;

    localStorage.setItem('receptorId', (this.receptorId ?? '').toString());

    localStorage.setItem('receptorNombre', this.receptorNombre);

    this.cargarMensajes();
  }

  cargarMensajes(): void {
    if (this.receptorId == null) return;

    this.chatService.getMensajes(this.usuarioActualId, this.receptorId).subscribe({
      next: (mensajes) => {
        this.mensajes = mensajes;
        setTimeout(() => this.scrollAlFinal(), 100);
      },
      error: () => Swal.fire('Error', 'No se pudieron cargar los mensajes', 'error')
    });
  }

  enviarMensaje(): void {
    if (!this.nuevoMensaje.trim() || this.receptorId == null) return;

    const nuevo = {
      contenido: this.nuevoMensaje,
      emisorId: this.usuarioActualId,
      receptorId: this.receptorId
    };

    this.chatService.enviarMensaje(nuevo).subscribe({
      next: (mensaje) => {
        this.mensajes.push(mensaje);
        this.nuevoMensaje = '';
        setTimeout(() => this.scrollAlFinal(), 100);
      },
      error: () => Swal.fire('Error', 'No se pudo enviar el mensaje', 'error')
    });
  }

  scrollAlFinal(): void {
    try {
      this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;
    } catch {}
  }
}
