import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PerfilUsuarioDTO {
  nombre: string;
  apellido: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private baseUrl = 'http://localhost:8080/perfil'; 

  constructor(private http: HttpClient) {}


  obtenerPerfil(): Observable<PerfilUsuarioDTO> {
    return this.http.get<PerfilUsuarioDTO>(`${this.baseUrl}`);
  }

  actualizarPerfil(dto: PerfilUsuarioDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}`, dto);
  }


  subirFoto(foto: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', foto);
    return this.http.post(`${this.baseUrl}/foto`, formData);
  }


  obtenerFoto(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/foto`, { responseType: 'blob' });
  }
}
