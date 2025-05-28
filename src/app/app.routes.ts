import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ChatComponent } from './components/chat/chat.component';
import { CarpetasComponent } from './components/carpetas/carpetas.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { AuthGuard } from './services/auth.guard'; 

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicio'
  },

  {
    path: 'inicio',
    component: InicioComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [AuthGuard]  // Protegida
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard]  // Protegida
  },
  {
    path: 'carpeta',
    component: CarpetasComponent,
    canActivate: [AuthGuard]  // Protegida
  },
  {
    path: 'calendario',
    component: CalendarioComponent,
    canActivate: [AuthGuard]
  },

];
