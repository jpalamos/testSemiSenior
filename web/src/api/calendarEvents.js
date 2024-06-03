import axios from 'axios';

export function calendarEventsGetEvents(params) {
  return new Promise((resolve, reject) => {
    axios.get("/calendarEvent/events", { params })
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}

export function calendarEventsGetMasters() {
  return new Promise((resolve, reject) => {
    axios.get("/calendarEvent/masters")
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}

export function updateCalendarEvent(eventId, formData) {
  return new Promise((resolve, reject) => {
    axios.patch("/calendarEvent/" + eventId, formData)
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}