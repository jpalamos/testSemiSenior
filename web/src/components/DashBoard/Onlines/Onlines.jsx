import React from 'react';
import { Grid, Typography } from '@mui/material';

export default function DashboardOnlines({ online }) {
  return <>
    <Grid container spacing={1} alignItems={"center"}>
      <Grid item xs={4} textAlign={"center"} >
        <Typography variant="h5">{online.roleId1}</Typography>
        <Typography variant="h9">Admins</Typography>
      </Grid>
      <Grid item xs={4} textAlign={"center"} >
        <Typography variant="h5">{online.roleId2}</Typography>
        <Typography variant="h9">Entrenadores</Typography>
      </Grid>
      <Grid item xs={4} textAlign={"center"} >
        <Typography variant="h5">{online.roleId3}</Typography>
        <Typography variant="h9">Recepción</Typography>
      </Grid>
    </Grid>

  </>
}