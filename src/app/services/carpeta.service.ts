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

  descargarCarpetaZip(dni: string): void {
  this.http.get(`${this.apiUrl}/descargar?dni=${dni}`, {
    headers: this.getAuthHeaders(),
    responseType: 'blob'
  }).subscribe({
    next: (blob: Blob) => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `${dni}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: () => {
      alert('Error al descargar el ZIP');
    }
  });
}

  descargarArchivo(dni: string, nombreArchivo: string): void {
  this.http.get(`${this.apiUrl}/archivo?dni=${dni}&nombreArchivo=${nombreArchivo}`, {
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


  eliminarArchivo(dni: string, archivo: string, descripcion: string): Observable<string> {
  return this.http.delete<string>(`${this.apiUrl}/archivo?dni=${dni}&nombreArchivo=${archivo}&descripcion=${descripcion}`, {
    headers: this.getAuthHeaders(),
    responseType: 'text' as 'json'
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

agregarArchivos(dni: string, archivos: File[], descripcion: string): Observable<string> {
  const formData = new FormData();
  formData.append('dni', dni);
  formData.append('descripcion', descripcion);
  archivos.forEach(file => formData.append('archivos', file));

  return this.http.post<string>(`${this.apiUrl}/actualizar`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    },
    responseType: 'text' as 'json'
  });
}

unirseACarpeta(dni: string): Observable<string> {
  return this.http.post(`${this.apiUrl}/unirse?dni=${dni}`, null, {
    headers: this.getAuthHeaders(),
    responseType: 'text'
  });
}

}

