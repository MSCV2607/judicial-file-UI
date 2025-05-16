import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthStateService } from '../../services/auth-state.service';
import { Router } from '@angular/router';
import { RegisterComponent } from "../register/register.component";

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RegisterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  modalRegistroVisible = false;
  loginForm: FormGroup;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authState: AuthStateService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  mostrarModalRegistro() {
    this.modalRegistroVisible = true;
  }

  cerrarModalRegistro() {
    this.modalRegistroVisible = false;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const payload = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.authService.login(payload).subscribe({
        next: (res: string) => {
          this.mensajeError = '';
          this.authState.login(); 
          this.router.navigate(['/dashboard']); 
        },
        error: (err: any) => {
          this.mensajeError = err.error || 'Error inesperado al iniciar sesión.';
        }
      });

    } else {
      this.mensajeError = 'Por favor completá todos los campos.';
      this.loginForm.markAllAsTouched();
    }
  }
}
