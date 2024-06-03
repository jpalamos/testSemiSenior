import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Avatar, CircularProgress, Container, Grid, ListItem, ListItemAvatar, ListItemText, Paper } from '@mui/material';
import Ventas from './Ventas/Ventas';
import VentasByPlans from './Ventas/VentasByPlans';
import VentasOld from './Ventas/VentasOld';
import AsistenciaBar from './Asistencias/AsistenciaBar';
import AsistenciaLastTable from './Asistencias/AsistenciaLastTable';
import Swal from 'sweetalert2';
import {
  HowToReg as HowToRegIcon,
  SportsKabaddi as SportsKabaddiIcon,
  AttachMoney as AttachMoneyIcon,
  OnlinePrediction as OnlinePredictionIcon,
} from '@mui/icons-material';
import { dashboardGetAll } from '../../api/dashboard';
import DashboardCustomer from './Customer/Customer';
import DashboardDates from './Dates/Dates';
import DashboardOnlines from './Onlines/Onlines';
import { useAuth } from '../../provider/AuthProvider';

const sxPaper = { p: 1, display: 'flex', flexDirection: 'column', boxShadow: '5px 7px 12px -5px #9f9fbb', height: 140, overflowY: 'auto' };
const sxPaperLG = { ...sxPaper, height: 340, }

export default function Dashboard() {
  const { token, authUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState({ roleId1: 0, roleId2: 0, roleId3: 0 });

  const [dataDashboard, setDataDashboard] = useState({
    customer: { customerCount: [], assistanceCount: [], },
    billing: {
      billingBar: { datasets: [], labels: [], },
      billingByPlans: [],
    },
    assistence: { list: [], bar: { datasets: [], labels: [] } },
    calendarEvents: { dates: [] }
  })

  useEffect(() => {
    setLoading(true);
    dashboardGetAll()
      .then((results) => setDataDashboard(results))
      .catch((err) => Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message,
      }))
      .finally(() => setLoading(false))
      ;

    function onConnect() {
      console.log("Conected");
    }

    function onDisconnect() {
      console.log("Disconected");
    }

    function updateConsumer(customerCount) {
      setDataDashboard(previous => ({ ...previous, customer: { ...previous.customer, customerCount } }));
    }
    function updateOnline(onlineCount) {
      setOnline(onlineCount);
    }
    function updateAssistence(newList) {
      setDataDashboard(previous => ({
        ...previous, assistence: {
          ...previous.assistence,
          list: [newList, ...previous.assistence.list]
        }
      }));
    }
    const socket = io(process.env.REACT_APP_URL_EVENT, {
      path: "/events/",
      auth: { token },
    });

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('dashboard:updateConsumer', updateConsumer);
    socket.on('dashboard:updateOnline', updateOnline);
    socket.on('dashboard:updateAssistence', updateAssistence);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('dashboard:updateConsumer', updateConsumer);
      socket.off('dashboard:updateOnline', updateOnline);
      socket.off('dashboard:updateAssistence', updateAssistence);
      socket.disconnect();
    };
  }, [token])

  return <Container maxWidth="xl" sx={{ mt: 2, mb: 1 }}>
    <Grid container spacing={3}>
      {[1].includes(authUser?.roleId) && (
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Paper sx={sxPaper}>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#64b6d6' }}>
                  {loading ? <CircularProgress sx={{ color: 'white' }} /> : <OnlinePredictionIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`Online`}
              />
            </ListItem>
            <DashboardOnlines
              online={online}
            />
          </Paper>
        </Grid>
      )}
      {[1, 2, 3].includes(authUser?.roleId) && (
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Paper sx={sxPaper}>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#f27474' }}>
                  {loading ? <CircularProgress sx={{ color: 'white' }} /> : <SportsKabaddiIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`Citas`}
              />
            </ListItem>
            <DashboardDates
              dates={dataDashboard.calendarEvents.dates}
            />
          </Paper>
        </Grid>
      )}
      {[1, 2].includes(authUser?.roleId) && (
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Paper sx={sxPaper}>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#81c784' }}>
                  {loading ? <CircularProgress sx={{ color: 'white' }} /> : <AttachMoneyIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`Pagos`}
              />
            </ListItem>
          </Paper>
        </Grid>
      )}
      {[1, 2].includes(authUser?.roleId) && (
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Paper sx={sxPaper}>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#5965f9' }}>
                  {loading ? <CircularProgress sx={{ color: 'white' }} /> : <HowToRegIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`Clientes: ${dataDashboard.customer.customerCount
                  .reduce((accumulator, { count }) => (accumulator + parseInt(count, 10)), 0)}`
                }
                secondary={`${dataDashboard.customer.assistanceCount
                  .filter(({ membershipStatusId }) => membershipStatusId === 1)
                  .reduce((accumulator, { count }) => (accumulator + parseInt(count, 10)), 0)} Ingresados | ${dataDashboard.customer.assistanceCount
                    .filter(({ membershipStatusId }) => membershipStatusId !== 1)
                    .reduce((accumulator, { count }) => (accumulator + parseInt(count, 10)), 0)} Rechazados`
                }
              />
            </ListItem>
            <DashboardCustomer dataDashboard={dataDashboard.customer.customerCount} />
          </Paper>
        </Grid>
      )}
      {[1, 2].includes(authUser?.roleId) && (
        <Grid item xs={12} md={8} lg={6}>
          <Paper sx={{ ...sxPaperLG, width: '100%', overflow: 'hidden' }}>
            <p>{loading && <CircularProgress size={15} />} Últimas asistencias</p>
            <div>
              <AsistenciaLastTable
                assistences={dataDashboard.assistence.list}
              />
            </div>
          </Paper>
        </Grid>
      )}
      {[1].includes(authUser?.roleId) && (
        <Grid item xs={12} md={4} lg={6}>
          <Paper sx={sxPaperLG}>
            <p>{loading && <CircularProgress size={15} />} Asistencias</p>
            <div style={{ height: '270px', }}>
              <AsistenciaBar
                assistences={dataDashboard.assistence.bar}
              />
            </div>
          </Paper>
        </Grid>
      )}
      {[1].includes(authUser?.roleId) && (
        <Grid item xs={12} md={4} lg={4}>
          <Paper sx={sxPaperLG}>
            <p>{loading && <CircularProgress size={15} />} Barra de Ventas Por Plan</p>
            <div style={{ height: '270px', }}>
              <VentasByPlans billing={dataDashboard.billing.billingByPlans} />
            </div>
          </Paper>
        </Grid>
      )}
      {[1, 2].includes(authUser?.roleId) && (
        <Grid item xs={12} md={8} lg={8}>
          <Paper sx={sxPaperLG}>
            <p>{loading && <CircularProgress size={15} />} Barra de Ventas</p>
            <div style={{ height: '270px', }}>
              <Ventas billing={dataDashboard.billing.billingBar} />
            </div>
          </Paper>
        </Grid>
      )}
      {[1].includes(authUser?.roleId) && (
        <Grid item xs={12} md={12} lg={12}>
          <Paper sx={sxPaperLG}>
            <p>{loading && <CircularProgress size={15} />} Valoraciones</p>
            <div style={{ height: '270px', }}>
              <VentasOld />
            </div>
          </Paper>
        </Grid>
      )}
    </Grid>
  </Container>
}