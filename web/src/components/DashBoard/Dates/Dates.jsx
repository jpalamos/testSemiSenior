import React from 'react';
import { Grid, Typography } from '@mui/material';

export default function DashboardDates({ dates }) {
  return <>
    <Grid container spacing={1} alignItems={"center"}>
      <Grid item xs={6} textAlign={"center"} >
        <Typography variant="h5">{dates.find(({ eventTypeId }) => eventTypeId === 2)?.count ?? 0}</Typography>
        <Typography variant="h9">Grupales</Typography>
      </Grid><Grid item xs={6} textAlign={"center"} >
        <Typography variant="h5">{dates.find(({ eventTypeId }) => eventTypeId === 1)?.count ?? 0}</Typography>
        <Typography variant="h9">Personalizados</Typography>
      </Grid>
    </Grid>

  </>
}