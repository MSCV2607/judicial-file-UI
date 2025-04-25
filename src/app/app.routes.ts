import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ChatComponent } from './components/chat/chat.component';
import { CarpetasComponent } from './components/carpetas/carpetas.component';
import { CalendarioComponent } from './components/calendario/calendario.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio'
    },

    //-----------------------------------------------------------

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
        component: PerfilComponent  // Ruta para perfil
      },
      {
        path: 'chat',
        component: ChatComponent  // Ruta para chat
      },
      {
        path: 'carpeta',
        component: CarpetasComponent  // Ruta para carpeta
      },
      {
        path: 'calendario',
        component: CalendarioComponent  // Ruta para calendario
      }
    ];