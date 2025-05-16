import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService, UsuarioActivo } from '../../services/auth-state.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: UsuarioActivo | null = null;

  constructor(private authState: AuthStateService) {}

  ngOnInit(): void {
    this.usuario = this.authState.getUsuario();
  }
}

