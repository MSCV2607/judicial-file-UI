import { Component } from '@angular/core';
import { RegisterComponent } from "../register/register.component";

@Component({
  selector: 'login',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  modalRegistroVisible = false;

  mostrarModalRegistro() {
    this.modalRegistroVisible = true;
  }

  cerrarModalRegistro() {
    this.modalRegistroVisible = false;
  }

}
