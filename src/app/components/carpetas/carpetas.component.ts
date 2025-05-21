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
  archivos: { [dni: string]: string[] } = {};
  archivosVisibles: { [dni: string]: boolean } = {};

  mostrarFormulario = false;
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  edad: number | null = null;
  telefono: string = '';
  correo: string = '';
  archivosNuevos: File[] = [];

  dniParaActualizar: string = '';
  archivosParaActualizar: File[] = [];
  descripcionActualizacion: string = '';

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
      error: () => Swal.fire('Error', 'Error al obtener archivos', 'error')
    });
  }

  descargarZip(dni: string): void {
    this.carpetaService.descargarCarpetaZip(dni);
  }

  descargarArchivo(dni: string, archivo: string): void {
    this.carpetaService.descargarArchivo(dni, archivo);
  }

  eliminarArchivo(dni: string, archivo: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Vas a eliminar un archivo. Escribe una descripción:',
      input: 'text',
      inputPlaceholder: 'Descripción del cambio',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const descripcion = result.value;
        this.carpetaService.eliminarArchivo(dni, archivo, descripcion).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Archivo eliminado correctamente', 'success');
            this.verArchivos(dni);
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el archivo', 'error')
        });
      }
    });
  }

  eliminarCarpeta(dni: string): void {
    Swal.fire({
      title: '¿Eliminar carpeta?',
      text: 'Esta acción es irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carpetaService.eliminarCarpeta(dni).subscribe({
          next: () => {
            this.carpetas = this.carpetas.filter(c => c.numeroCarpeta !== dni);
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
    if (!this.nombre || !this.apellido || !this.dni || this.archivosNuevos.length === 0) {
      Swal.fire('Faltan datos', 'Completá todos los campos y seleccioná archivos', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('apellido', this.apellido);
    formData.append('dni', this.dni);
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

  onSeleccionarArchivosActualizar(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.archivosParaActualizar = Array.from(input.files);
    }
  }

  abrirFormularioActualizacion(dni: string): void {
    this.dniParaActualizar = dni;
    this.descripcionActualizacion = '';
    this.archivosParaActualizar = [];
  }

  subirArchivosActualizados(): void {
    if (!this.archivosParaActualizar.length || !this.descripcionActualizacion) {
      Swal.fire('Error', 'Seleccioná archivos y escribí una descripción', 'warning');
      return;
    }

    this.carpetaService.agregarArchivos(this.dniParaActualizar, this.archivosParaActualizar, this.descripcionActualizacion)
      .subscribe({
        next: () => {
          Swal.fire('Éxito', 'Archivos actualizados correctamente', 'success');
          this.dniParaActualizar = '';
          this.archivosParaActualizar = [];
          this.descripcionActualizacion = '';
          this.listar();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar la carpeta', 'error')
      });
  }
}
