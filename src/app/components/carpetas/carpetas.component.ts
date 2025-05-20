import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CarpetaService } from '../../services/carpeta.service';

@Component({
  selector: 'app-carpetas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './carpetas.component.html',
  styleUrls: ['./carpetas.component.css']
})
export class CarpetasComponent implements OnInit {
  carpetas: any[] = [];
  busqueda: string = '';
  archivos: { [dni: string]: string[] } = {};
  archivosVisibles: { [dni: string]: boolean } = {};

  constructor(private carpetaService: CarpetaService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.carpetaService.listarCarpetas().subscribe({
      next: (data: any[]) => this.carpetas = data,
      error: () => alert('Error al cargar carpetas')
    });
  }

  buscar(): void {
    if (this.busqueda.trim() === '') {
      this.listar();
      return;
    }

    this.carpetaService.buscarCarpetas(this.busqueda).subscribe({
      next: (data: any[]) => this.carpetas = data,
      error: () => alert('Error en la búsqueda')
    });
  }

  verArchivos(dni: string): void {
    if (this.archivosVisibles[dni]) {
      this.archivosVisibles[dni] = false;
      return;
    }

    this.carpetaService.verArchivos(dni).subscribe({
      next: (data: string[]) => {
        this.archivos[dni] = data;
        this.archivosVisibles[dni] = true;
      },
      error: () => alert('Error al obtener archivos')
    });
  }

  descargarZip(dni: string): void {
    this.carpetaService.descargarCarpetaZip(dni).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dni}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Error al descargar la carpeta')
    });
  }

  descargarArchivo(dni: string, archivo: string): void {
    this.carpetaService.descargarArchivo(dni, archivo).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = archivo;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Error al descargar archivo')
    });
  }

  eliminarArchivo(dni: string, archivo: string): void {
    const descripcion = prompt('¿Qué estás eliminando? Escribe una descripción:');
    if (!descripcion) return;

    this.carpetaService.eliminarArchivo(dni, archivo, descripcion).subscribe({
      next: () => {
        alert('Archivo eliminado');
        this.verArchivos(dni);
      },
      error: () => alert('Error al eliminar archivo')
    });
  }

  eliminarCarpeta(dni: string): void {
    if (!confirm('¿Seguro que deseas eliminar la carpeta completa?')) return;

    this.carpetaService.eliminarCarpeta(dni).subscribe({
      next: () => {
        alert('Carpeta eliminada');
        this.listar();
      },
      error: () => alert('Error al eliminar carpeta')
    });
  }
}

