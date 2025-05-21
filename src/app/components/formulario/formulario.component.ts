import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CarpetaService } from '../../services/carpeta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './formulario.component.html'
})
export class FormularioComponent {
  nombre: string = '';
  apellido: string = '';
  dni: string = '';
  edad: number | null = null;
  telefono: string = '';
  correo: string = '';
  archivos: File[] = [];

  constructor(private carpetaService: CarpetaService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.archivos = Array.from(input.files);
    }
  }

  crearCarpeta(): void {
    if (!this.nombre || !this.apellido || !this.dni || this.archivos.length === 0) {
      Swal.fire('Faltan campos', 'Completá todos los datos y seleccioná archivos', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('apellido', this.apellido);
    formData.append('dni', this.dni);
    formData.append('telefono', this.telefono || 'N/A');
    formData.append('correo', this.correo || 'N/A');
    formData.append('edad', this.edad !== null ? String(this.edad) : '0');

    this.archivos.forEach(file => formData.append('archivos', file));

    this.carpetaService.crearCarpeta(formData).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Carpeta creada correctamente', 'success');
        this.nombre = '';
        this.apellido = '';
        this.dni = '';
        this.edad = null;
        this.telefono = '';
        this.correo = '';
        this.archivos = [];
      },
      error: (err) => {
        const msg = err.status === 400 ? err.error : 'Error al crear carpeta';
        Swal.fire('Error', msg, 'error');
      }
    });
  }
}
