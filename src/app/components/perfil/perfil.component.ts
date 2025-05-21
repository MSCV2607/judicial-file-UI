import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← necesario para ngModel
import { HttpClientModule } from '@angular/common/http';
import { PerfilService, PerfilUsuarioDTO } from '../../services/perfil.service';

@Component({
  selector: 'app-perfil',
  standalone: true, // ← importante si estás usando Angular 15+ standalone
  imports: [CommonModule, FormsModule, HttpClientModule], // ← importa FormsModule acá
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfil: PerfilUsuarioDTO = {
    nombre: '',
    apellido: '',
    username: '',
    email: ''
  };

  imagenUrl: string | null = null;
  imagenSeleccionada: File | null = null;
  mensaje: string = '';

  constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    this.cargarPerfil();
    this.cargarFoto();
  }

  cargarPerfil(): void {
    this.perfilService.obtenerPerfil().subscribe({
      next: (data) => this.perfil = data,
      error: () => this.mensaje = 'Error al cargar el perfil'
    });
  }

  guardarCambios(): void {
    this.perfilService.actualizarPerfil(this.perfil).subscribe({
      next: () => this.mensaje = 'Perfil actualizado correctamente',
      error: () => this.mensaje = 'Error al actualizar el perfil'
    });
  }

  seleccionarFoto(event: any): void {
    const archivo: File = event.target.files[0];
    if (archivo) {
      this.imagenSeleccionada = archivo;
    }
  }

  subirFoto(): void {
    if (!this.imagenSeleccionada) {
      this.mensaje = 'Seleccione una imagen antes de subir';
      return;
    }

    this.perfilService.subirFoto(this.imagenSeleccionada).subscribe({
      next: () => {
        this.mensaje = 'Foto actualizada correctamente';
        this.cargarFoto(); // recarga la imagen
      },
      error: () => this.mensaje = 'Error al subir la foto'
    });
  }

  cargarFoto(): void {
    this.perfilService.obtenerFoto().subscribe({
      next: (blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagenUrl = reader.result as string;
        };
        reader.readAsDataURL(blob);
      },
      error: () => this.imagenUrl = null
    });
  }
}
