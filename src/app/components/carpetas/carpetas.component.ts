// src/app/components/carpetas/carpetas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CarpetaService } from '../../services/carpeta.service';
import Swal from 'sweetalert2';
import { NavBarComponent } from "../nav-bar/nav-bar.component";

@Component({
  selector: 'app-carpetas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NavBarComponent],
  templateUrl: './carpetas.component.html',
  styleUrls: ['./carpetas.component.css']
})
export class CarpetasComponent implements OnInit {
  carpetas: any[] = [];
  busqueda: string = '';
  archivos: { [id: number]: string[] } = {};
  archivosVisibles: { [id: number]: boolean } = {};

  mostrarFormulario = false;
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  edad: number | null = null;
  telefono: string = '';
  correo: string = '';
  nombreCarpeta: string = '';
  archivosNuevos: File[] = [];

  carpetaIdActualizar: number | null = null;
  archivosParaActualizar: File[] = [];
  descripcionActualizacion: string = '';

  idUnirse: string = '';

  ordenSeleccionado: string = '';

  constructor(private carpetaService: CarpetaService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.carpetaService.listarCarpetas().subscribe({
      next: (data) => this.carpetas = data,
      error: () => Swal.fire('Error', 'No se pudieron cargar las carpetas', 'error')
    });
  }

  buscar(): void {
    if (this.busqueda.trim() === '') {
      this.listar();
      return;
    }

    this.carpetaService.buscarCarpetas(this.busqueda).subscribe({
      next: (data) => this.carpetas = data,
      error: () => Swal.fire('Error', 'Error en la búsqueda', 'error')
    });
  }

  verArchivos(id: number): void {
    if (this.archivosVisibles[id]) {
      this.archivosVisibles[id] = false;
      return;
    }

    this.carpetaService.verArchivos(id).subscribe({
      next: (data) => {
        this.archivos[id] = data;
        this.archivosVisibles[id] = true;
      },
      error: () => Swal.fire('Error', 'No se pudieron obtener los archivos', 'error')
    });
  }

  descargarZip(id: number): void {
    this.carpetaService.descargarCarpetaZip(id);
  }

  descargarArchivo(id: number, archivo: string): void {
    this.carpetaService.descargarArchivo(id, archivo);
  }

  eliminarArchivo(id: number, archivo: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Vas a eliminar un archivo. Escribe una descripción:',
      input: 'text',
      inputPlaceholder: 'Descripción del cambio',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const descripcion = result.value;
        this.carpetaService.eliminarArchivo(id, archivo, descripcion).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Archivo eliminado correctamente', 'success');
            this.verArchivos(id);
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el archivo', 'error')
        });
      }
    });
  }

  eliminarCarpeta(id: number): void {
    Swal.fire({
      title: '¿Eliminar carpeta?',
      text: 'Esta acción es irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carpetaService.eliminarCarpeta(id).subscribe({
          next: () => {
            this.carpetas = this.carpetas.filter(c => c.id !== id);
            Swal.fire('Eliminado', 'La carpeta fue eliminada correctamente.', 'success');
          },
          error: (err) => {
            Swal.fire('Error', err?.error || 'Error al eliminar la carpeta', 'error');
          }
        });
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.archivosNuevos = Array.from(input.files);
    }
  }

  crearCarpeta(): void {
    if (!this.nombre || !this.apellido || !this.dni || !this.nombreCarpeta || this.archivosNuevos.length === 0) {
      Swal.fire('Faltan datos', 'Completá todos los campos obligatorios y seleccioná archivos', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('apellido', this.apellido);
    formData.append('dni', this.dni);
    formData.append('nombreCarpeta', this.nombreCarpeta);
    formData.append('edad', this.edad !== null ? String(this.edad) : '0');
    formData.append('telefono', this.telefono || 'N/A');
    formData.append('correo', this.correo || 'N/A');

    this.archivosNuevos.forEach(file => formData.append('archivos', file));

    this.carpetaService.crearCarpeta(formData).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Carpeta creada correctamente', 'success');
        this.mostrarFormulario = false;
        this.nombre = '';
        this.apellido = '';
        this.dni = '';
        this.nombreCarpeta = '';
        this.edad = null;
        this.telefono = '';
        this.correo = '';
        this.archivosNuevos = [];
        this.listar();
      },
      error: (err) => {
        const msg = err.status === 400 ? err.error : 'Error al crear carpeta';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  abrirFormularioActualizacion(id: number): void {
    this.carpetaIdActualizar = id;
    this.descripcionActualizacion = '';
    this.archivosParaActualizar = [];
  }

  onSeleccionarArchivosActualizar(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.archivosParaActualizar = Array.from(input.files);
    }
  }

  subirArchivosActualizados(): void {
    if (!this.descripcionActualizacion || !this.archivosParaActualizar.length || this.carpetaIdActualizar === null) {
      Swal.fire('Error', 'Completá los campos para actualizar', 'warning');
      return;
    }

    this.carpetaService.agregarArchivos(this.carpetaIdActualizar, this.archivosParaActualizar, this.descripcionActualizacion)
      .subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Archivos subidos correctamente', 'success');
          this.carpetaIdActualizar = null;
          this.archivosParaActualizar = [];
          this.descripcionActualizacion = '';
          this.listar();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar la carpeta', 'error')
      });
  }

  unirseACarpeta(): void {
    const id = parseInt(this.idUnirse.trim());
    if (!id || isNaN(id)) {
      Swal.fire('Error', 'Ingresá un ID válido', 'warning');
      return;
    }

    this.carpetaService.unirseACarpeta(id).subscribe({
      next: () => {
        Swal.fire('Unido', 'Te uniste a la carpeta correctamente', 'success');
        this.idUnirse = '';
        this.listar();
      },
      error: () => Swal.fire('Error', 'No se pudo unir a la carpeta', 'error')
    });
  }

  ordenarCarpetas(): void {
    switch (this.ordenSeleccionado) {
      case 'nombreAZ':
        this.carpetas.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        break;
      case 'nombreZA':
        this.carpetas.sort((a, b) => b.descripcion.localeCompare(a.descripcion));
        break;
      case 'actualizacionReciente':
        this.carpetas.sort((a, b) => new Date(b.ultimaActualizacion).getTime() - new Date(a.ultimaActualizacion).getTime());
        break;
      case 'actualizacionVieja':
        this.carpetas.sort((a, b) => new Date(a.ultimaActualizacion).getTime() - new Date(b.ultimaActualizacion).getTime());
        break;
      case 'creacionNueva':
        this.carpetas.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        break;
      case 'creacionVieja':
        this.carpetas.sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime());
        break;
      default:
        break;
    }
  }
}
