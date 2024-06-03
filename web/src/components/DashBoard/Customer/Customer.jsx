import React from 'react';
import { Grid, Typography } from '@mui/material';

export default function DashboardCustomer({ dataDashboard }) {

  return <>
    <Grid container spacing={1} alignItems={"center"}>
      <Grid item xs={6} textAlign={"center"} >
        <Typography>{dataDashboard.find(({ membershipStatusId }) => membershipStatusId === 1)?.count ?? 0}</Typography>
        <Typography>Activos</Typography>
      </Grid>
      <Grid item xs={6}>
        <div>
          <Typography>
            {dataDashboard.find(({ membershipStatusId }) => membershipStatusId === 2)?.count ?? 0} Inactivos
          </Typography>
        </div>
        <div>
          <Typography>
            {dataDashboard.find(({ membershipStatusId }) => membershipStatusId === 3)?.count ?? 0} Suspendidos
          </Typography>
        </div>
      </Grid>
    </Grid>

  </>
}