import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() cerrar = new EventEmitter<void>();
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      DNI: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Datos del usuario:', this.registerForm.value);
      // Acá podrías emitir los datos o mandarlos al backend
      this.cerrar.emit(); // Cerramos el modal después del registro
    } else {
      this.registerForm.markAllAsTouched(); // Muestra errores si hay campos vacíos
    }
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
