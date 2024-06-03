import React, { useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, Autocomplete } from '@mui/material';
import { HowToReg as HowToRegIcon } from '@mui/icons-material';
import { DateTimePickerComponent, TimePickerComponent } from '../commons/datePicker/datePicker';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { updateCalendarEvent } from '../../api/calendarEvents';

export default function DateEventForm({ masters, formDataInit, close }) {
  const [loading, setLoading] = useState(false);
  const [formDataErr, setFormDataErr] = useState({});
  const [formData, setFormData] = useState({
    customers: formDataInit.calendar_event_customers
      ? formDataInit.calendar_event_customers.map(({ customerId, customer }) =>
        ({ customerId, firstName: customer.firstName, lastName: customer.lastName })
      )
      : [],
    trainers: formDataInit.calendar_event_trainers
      ? formDataInit.calendar_event_trainers.map(({ userId, user }) =>
        ({ userId, users_personal_info: user.users_personal_info })
      )
      : [],
    locationId: formDataInit.locationId ?? '',
    title: formDataInit.title ?? '',
    eventTypeId: formDataInit.eventTypeId ?? '',
    start: formDataInit?.start ? dayjs(formDataInit?.start) : dayjs().add(1, 'hour').startOf('hour'),
    duration: formDataInit?.start
      ? dayjs().hour(dayjs(formDataInit?.end).diff(dayjs(formDataInit.start), 'hour')).minute(dayjs(formDataInit?.end).diff(dayjs(formDataInit.start), 'minute') % 60)
      : '01:00',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === 'identityCard' && !/^\d*$/.test(value)) ||
      (['firstName', 'firstLastName'].includes(name) && !/(^$)|(^[a-zA-Z]+(\s?|(\s+[a-zA-Z]+))?$)/.test(value))
    ) {
      return;
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setFormDataErr((prevDataErr) => ({ ...prevDataErr, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataFormErr = {};
    for (const [key, value] of Object.entries(formData)) {
      if (['title'].includes(key)) {
        if (String(value).length < 3) dataFormErr[key] = 'err';
      } else if (['duration', 'locationId', 'eventTypeId', 'start'].includes(key)) {
        if (!value) dataFormErr[key] = 'err';
      } else {
        if (value.length < 1) dataFormErr[key] = 'err';
      }
    }
    setFormDataErr(dataFormErr);
    if (Object.values(dataFormErr).length > 0) {
      Swal.fire({
        icon: "warning",
        title: "",
        text: 'Faltan campos por tramitar',
      })
    } else {
      console.log({
        start: formData.start,
        end: dayjs(formData.start).hour(dayjs(formData.duration).hour()).minute(dayjs(formData.duration).minute())
      })
      setLoading(true);
      updateCalendarEvent(formDataInit.eventId ?? 0,
        {
          ...formData,
          end: dayjs(formData.start).add(dayjs(formData.duration).hour(), 'hour').add(dayjs(formData.duration).minute(), 'minute')
        }
      )
        .then((results) => close())
        .catch((err) => Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response?.data?.message,
        }))
        .finally(() => setLoading(false))
    }
  };

  return <form onSubmit={handleSubmit}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <FormControl
          fullWidth
          margin="normal"
          error={formDataErr.eventTypeId === 'err'}
        >
          <InputLabel id="eventType-select-label">Tipo de evento</InputLabel>
          <Select
            labelId="eventType-select-label"
            id="eventType-select"
            label="Tipo de evento"
            name="eventTypeId"
            value={formData.eventTypeId}
            onChange={handleChange}
          >
            {masters.eventTypes.map(({ eventTypeId, typeName }) => (
              <MenuItem key={eventTypeId} value={String(eventTypeId)}>
                {typeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={12}>
        <TextField
          label="Evento"
          variant="outlined"
          autoComplete="off"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={formDataErr.title === 'err'}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <FormControl
          fullWidth
          margin="normal"
          error={formDataErr.locationId === 'err'}
        >
          <InputLabel id="location-select-label">Sede</InputLabel>
          <Select
            labelId="location-select-label"
            id="location-select"
            label="Sede"
            name="locationId"
            value={formData.locationId}
            onChange={handleChange}
          >
            {masters.locations.map(({ locationId, location }) => (
              <MenuItem key={locationId} value={String(locationId)}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl
          fullWidth
          margin="normal"
        >
          <DateTimePickerComponent
            error={formDataErr.start === 'err'}
            label="Fecha"
            value={formData.start}
            name="start"
            openTo="day"
            ampm={true}
            skipDisabled={true}
            timeSteps={{ hours: 1, minutes: 15, }}
            shouldDisableYear={(date) => date.isBefore(dayjs().startOf('year')) || date.isAfter(dayjs().endOf('year'))}
            shouldDisableDate={(date) => date.isBefore(dayjs().startOf('month')) || date.isAfter(dayjs().add(1, 'month').endOf('month'))}
            shouldDisableTime={(time) => time.hour() < 6 || time.hour() >= 21}
            onChange={(dateTime) => setFormData((prevData) => ({ ...prevData, start: dateTime }))}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl
          fullWidth
          margin="normal"
        >
          <TimePickerComponent
            error={formDataErr.duration === 'err'}
            label="Duración"
            value={formData.duration}
            name="duration"
            timeSteps={{ hours: 1, minutes: 15, }}
            shouldDisableTime={(time) => time.hour() >= 4}
            skipDisabled={true}
            onChange={(dateTime) => setFormData((prevData) => ({ ...prevData, duration: dateTime }))}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} md={12}>
        <Autocomplete
          multiple
          error={formDataErr.customers === 'err'}
          noOptionsText={'No encontrado'}
          id="tags-customer"
          limitTags={2}
          value={useMemo(
            () => formData.customers,
            [formData.customers],
          )}
          onChange={(event, newValue) => {
            setFormData((prevData) => ({ ...prevData, customers: newValue }));
            setFormDataErr((prevDataErr) => ({ ...prevDataErr, customers: '' }));
          }}
          options={masters.customers ?? []}
          getOptionLabel={({ firstName, lastName }) => `${lastName} ${firstName}`}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              error={formDataErr.customers === 'err'}
              label="Clientes"
              placeholder="Añadir cliente"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <Autocomplete
          multiple
          noOptionsText={'No encontrado'}
          id="tags-trainers"
          limitTags={2}
          value={useMemo(
            () => formData.trainers,
            [formData.trainers],
          )}
          onChange={(event, newValue) => {
            setFormData((prevData) => ({ ...prevData, trainers: newValue }));
            setFormDataErr((prevDataErr) => ({ ...prevDataErr, trainers: '' }));
          }}
          options={masters.trainers ?? []}
          getOptionLabel={({ users_personal_info }) => `${users_personal_info.firstLastName} ${users_personal_info.firstName}`}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              error={formDataErr.trainers === 'err'}
              label="Entrenadores"
              placeholder="Añadir entrenador"
            />
          )}
        />
      </Grid>
    </Grid>
    <LoadingButton
      type="submit"
      variant="contained"
      color="primary"
      disabled={loading}
      fullWidth
      loading={loading}
      loadingPosition="end"
      endIcon={<HowToRegIcon />}
    >
      {formDataInit.eventId ? 'Editar' : 'Crear nuevo'} evento
    </LoadingButton>
  </form >
}