import React from 'react';
import "dayjs/locale/es";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export function DatePickerComponent({ ...props }) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="es"
    >
      <DatePicker
        {...props}
      />
    </LocalizationProvider>
  );
}

export function DateTimePickerComponent({ ...props }) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="es"
    >
      <DateTimePicker
        {...props}
      />
    </LocalizationProvider>
  );
}

export function TimePickerComponent({ ...props }) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="es"
    >
      <TimePicker
        {...props}
        formatDensity={'spacious'}
      />
    </LocalizationProvider>
  );
}