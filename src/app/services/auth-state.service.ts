import { Injectable } from '@angular/core';

export interface UsuarioActivo {
  nombre: string;
  apellido: string;
  dni: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private loggedIn = false;
  private usuario: UsuarioActivo | null = null;

  login(usuario?: UsuarioActivo) {
    this.loggedIn = true;
    if (usuario) {
      this.usuario = usuario;
    }
  }

  logout() {
    this.loggedIn = false;
    this.usuario = null;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUsuario(): UsuarioActivo | null {
    return this.usuario;
  }
}
