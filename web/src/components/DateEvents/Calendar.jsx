import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from 'dayjs';

export default function Calendar({ calendarEvents, openEvent }) {
  return <FullCalendar
    plugins={[dayGridPlugin, timeGridPlugin, multiMonthPlugin, interactionPlugin]}
    initialView="timeGridWeek"
    headerToolbar={{
      start: 'timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear',
      center: 'title',
      end: 'prev,next today',
    }}
    locale={'es'}
    longPressDelay={250}
    eventLongPressDelay={250}
    selectLongPressDelay={250}
    buttonText={{ today: 'hoy', day: 'Por Día', week: 'Por Semana', month: 'Por Mes', year: 'Por Año' }}
    allDaySlot={false}
    selectable={true}
    selectMirror={true}
    nowIndicator={true}
    slotEventOverlap={false}
    eventOverlap={false}
    selectOverlap={false}
    droppable={false}
    firstDay={1}
    businessHours={{
      startTime: '05:00',
      endTime: '21:30',
      daysOfWeek: [1, 2, 3, 4, 5, 6]
    }}
    scrollTime={'05:00:00'}
    scrollTimeReset={false}
    slotLabelFormat={{
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    }}
    validRange={(nowDate) => {
      return {
        start: dayjs(nowDate).startOf('hour'),
        end: dayjs(nowDate).add(1, 'month').endOf('month')
      }
    }}
    eventClick={({ event }) => {
      openEvent({
        end: event?.endStr,
        start: event?.startStr,
        title: event?._def?.title,
        ...event?._def?.extendedProps
      })
    }}
    select={({ startStr, endStr }) => {
      openEvent({
        end: endStr,
        start: startStr,
        title: '',
      })
    }}
    selectAllow={({ startStr, endStr }) =>
      dayjs(endStr).diff(dayjs(startStr), 'hour') <= 3
    }
    events={calendarEvents}
    eventContent={(eventInfo) => {
      const { calendar_event_trainers, calendar_event_customers } = eventInfo.event.extendedProps;
      const { title } = eventInfo.event;
      return (
        <>
          <div>
            <b>{eventInfo.timeText}</b>
          </div>
          <div>
            <i>{title}</i>
          </div>
          <div>
            <label>Entrenador{calendar_event_trainers?.length > 0 ? 'es' : ''}: <strong>{
              calendar_event_trainers?.map((trainer) => `${trainer.user?.users_personal_info?.firstName} ${trainer.user?.users_personal_info?.firstLastName}`)
                .join(' | ')
            }</strong></label>
          </div>
          <div>
            <label>Cliente{calendar_event_customers?.length > 0 ? 's' : ''}: <strong>{
              calendar_event_customers?.map((customer) => `${customer.customer?.firstName} ${customer.customer?.lastName}`)
                .join(' | ')}</strong></label>
          </div>
        </>
      )
    }}
  />
}