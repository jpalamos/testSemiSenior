import React, { useCallback, useEffect, useState } from 'react';
import { Button, ButtonGroup, CircularProgress, Container, Dialog, DialogContent, DialogTitle, Grid, Paper } from '@mui/material';
import Calendar from './Calendar';
import DateEventForm from './DateEventForm';
import Swal from 'sweetalert2';
import { calendarEventsGetEvents, calendarEventsGetMasters } from '../../api/calendarEvents';
export default function DateEvent() {
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [filters, setFilters] = useState({ locations: [1, 2] })
  const [event, setEvent] = useState({});
  const [masters, setMasters] = useState({ locations: [], trainers: [], eventTypes: [], customers: [] })
  useEffect(() => {
    setLoading(true);
    Promise.all([
      calendarEventsGetMasters(),
      calendarEventsGetEvents({ locations: [1, 2] }),
    ])
      .then(([masters, events]) => {
        setMasters(masters)
        setCalendarEvents(events.map((event) => {
          return {
            ...event,
            backgroundColor: event.locationId === 1 ? '#5965f9' : '#0cc18e',
          }
        }))
      })
      .catch((err) => Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message,
      }))
      .finally(() => setLoading(false));
  }, [])

  const refresh = useCallback(() => {
    setLoading(true);
    calendarEventsGetEvents(filters)
      .then((events) => {
        setCalendarEvents(events.map((event) => {
          return {
            ...event,
            backgroundColor: event.locationId === 1 ? '#5965f9' : '#0cc18e',
          }
        }))
      })
      .catch((err) => Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message,
      }))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    refresh()
  }, [filters, refresh])
  const handleCloseDialog = () => setOpenDialog(false);

  return <Container maxWidth="xl" sx={{ mt: 2, mb: 1 }}>
    <Grid container spacing={3} justifyContent={'center'}>
      {masters.locations.length > 0 &&
        <Grid item xs={12} md={12} lg={9}>
          <Paper sx={{
            p: 2, display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div>
              <ButtonGroup
                color={filters.locations.length < 1 ? "error" : undefined}
              >
                {masters.locations.map(({ locationId, location }) => (
                  <Button
                    key={locationId}
                    variant={filters.locations.includes(locationId) ? 'contained' : 'outlined'}
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      locations: prev.locations.includes(locationId)
                        ? prev.locations.filter((item) => item !== locationId)
                        : prev.locations.concat(locationId)
                    }))}
                  >{location}</Button>))}
              </ButtonGroup>
              {filters.locations.length < 1 && <div style={{ color: 'red', textAlign: 'center' }}>
                <span >Seleccione al menos una sede!</span>
              </div>}
            </div>
          </Paper>
        </Grid>
      }
      <Grid item md={12} lg={9} sx={{ overflowX: 'auto' }}>
        <Paper sx={{ p: 2, minWidth: '375px' }} >
          <Calendar
            calendarEvents={calendarEvents}
            openEvent={(eventInit) => {
              setEvent(eventInit);
              setOpenDialog(true);
            }}
          />
          {loading && <div style={{ textAlign: 'center' }}>
            <CircularProgress size={20} style={{ marginRight: 10 }} />
            Cargando...
          </div>
          }
        </Paper>
      </Grid>
    </Grid>

    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
    >
      <DialogTitle>Cita {event.eventId}</DialogTitle>
      <DialogContent>
        <DateEventForm
          close={() => {
            handleCloseDialog();
            refresh();
          }}
          masters={masters}
          formDataInit={event}
        />
      </DialogContent>
    </Dialog>
  </Container >
}