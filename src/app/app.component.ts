import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InicioComponent } from "./components/inicio.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { CalendarioComponent } from './components/calendario/calendario.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InicioComponent, FooterComponent, NavBarComponent, CalendarioComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {
  title = 'judicial-file-UI';
}
