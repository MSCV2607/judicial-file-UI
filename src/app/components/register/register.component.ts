import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, RegisterPayload } from '../../services/auth.service';


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
  mensaje: string = '';
  error: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
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
      const payload: RegisterPayload = {
        nombre: this.registerForm.value.nombre,
        apellido: this.registerForm.value.apellidos,
        dni: this.registerForm.value.DNI,
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(payload).subscribe({
        next: (res) => {
          this.mensaje = res;
          this.error = '';
          this.cerrar.emit(); // o redirigir
        },
        error: (err) => {
          this.error = err.error || 'Error inesperado.';
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
