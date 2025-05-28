import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from "../nav-bar/nav-bar.component"; 

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule, NavBarComponent],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent {
  nuevoEvento = {
    fecha: '',
    titulo: '',
    descripcion: ''
  };

  calendarOptions: any;

  constructor() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      editable: true,
      selectable: true,
      locale: 'es',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'newEventButton'
      },
      customButtons: {
        newEventButton: {
          text: 'Nuevo evento',
          click: () => {
            this.abrirModal();
          }
        }
      },
      events: [
        { title: 'Evento de prueba', date: '2025-04-20' },
        { title: 'Otro evento', date: '2025-04-22' }
      ],
      dateClick: (info: any) => {
        alert('Se clickeó el día: ' + info.dateStr);
      }
    };
  }

  abrirModal() {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('nuevoEventoModal'));
    modal.show();
  }

  crearEvento() {
 
    this.calendarOptions.events.push({
      title: this.nuevoEvento.titulo,
      date: this.nuevoEvento.fecha,
      description: this.nuevoEvento.descripcion
    });

 
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('nuevoEventoModal'));
    modal.hide();

    this.nuevoEvento = { fecha: '', titulo: '', descripcion: '' };
  }
}
