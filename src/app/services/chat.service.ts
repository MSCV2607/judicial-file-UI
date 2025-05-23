import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMensajeDTO {
  contenido: string;
  emisorId: number;
  receptorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, {
      headers: this.getAuthHeaders()
    });
  }

  getMensajes(emisorId: number, receptorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/chatmensajes/conversacion?emisorId=${emisorId}&receptorId=${receptorId}`, {
      headers: this.getAuthHeaders()
    });
  }

  enviarMensaje(mensajeDTO: ChatMensajeDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/chatmensajes`, mensajeDTO, {
      headers: this.getAuthHeaders()
    });
  }
}
