import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio'
    },

    //-----------------------------------------------------------

    {
        path: 'inicio',
        component : InicioComponent
        
    },
    {
      path: 'login',
      component: LoginComponent
    }



];
