import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent {
  calendarOptions = {
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
          alert('Nuevo evento creado!');
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
