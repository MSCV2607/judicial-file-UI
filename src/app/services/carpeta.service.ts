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

  verArchivos(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/archivos/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  descargarCarpetaZip(id: number): void {
    this.http.get(`${this.apiUrl}/descargar?id=${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = `expediente_${id}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Error al descargar el ZIP');
      }
    });
  }

  descargarArchivo(id: number, nombreArchivo: string): void {
    this.http.get(`${this.apiUrl}/archivo?id=${id}&nombreArchivo=${nombreArchivo}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = nombreArchivo;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Error al descargar el archivo');
      }
    });
  }

  eliminarArchivo(id: number, archivo: string, descripcion: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/archivo?id=${id}&nombreArchivo=${archivo}&descripcion=${descripcion}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }

  eliminarCarpeta(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/eliminar?id=${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }

  crearCarpeta(formData: FormData): Observable<string> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
  });

  return this.http.post(`${this.apiUrl}/crear`, formData, {
    headers: headers,
    responseType: 'text'
  });
}


  agregarArchivos(id: number, archivos: File[], descripcion: string): Observable<string> {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('descripcion', descripcion);
    archivos.forEach(file => formData.append('archivos', file));

    return this.http.post<string>(`${this.apiUrl}/actualizar`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      },
      responseType: 'text' as 'json'
    });
  }

  unirseACarpeta(id: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/unirse?id=${id}`, null, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
}


