import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarpetaService {
  private apiUrl = 'http://localhost:8080/carpetas';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listarCarpetas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`, {
      headers: this.getAuthHeaders()
    });
  }

  buscarCarpetas(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar?query=${query}`, {
      headers: this.getAuthHeaders()
    });
  }

  verArchivos(dni: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/archivos/${dni}`, {
      headers: this.getAuthHeaders()
    });
  }

  descargarCarpetaZip(dni: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/descargar?dni=${dni}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  descargarArchivo(dni: string, archivo: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/archivo?dni=${dni}&nombreArchivo=${archivo}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  eliminarArchivo(dni: string, archivo: string, descripcion: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/archivo?dni=${dni}&nombreArchivo=${archivo}&descripcion=${descripcion}`, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarCarpeta(dni: string): Observable<string> {
  return this.http.delete<string>(`${this.apiUrl}/eliminar?dni=${dni}`, {
  headers: this.getAuthHeaders(),
  responseType: 'text' as 'json'
});

}

  crearCarpeta(formData: FormData): Observable<string> {
  return this.http.post('http://localhost:8080/carpetas/crear', formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    },
    responseType: 'text'
  });
}

}

