import React, { useEffect, useState } from 'react';
import { Avatar, Container, Dialog, DialogContent, DialogTitle, Grid, InputAdornment, ListItem, ListItemAvatar, ListItemText, Paper, TextField } from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  LocationOn as LocationOnIcon,
  MonetizationOn as MonetizationOnIcon,
  SupervisedUserCircle as SupervisedUserCircleIcon
} from '@mui/icons-material';
import { configGetmasters } from '../../api/config';
import ConfigLocation from './ConfigLocation';

const configList = [
  { logo: <LocationOnIcon />, title: 'Sedes', description: 'Configurar las sedes disponibles', modulo: 'configLocation' },
  { logo: <MonetizationOnIcon />, title: 'Planes', description: 'Configurar planes', modulo: 'configPlans' },
  { logo: <SupervisedUserCircleIcon />, title: 'Roles', description: 'Configurar roles', modulo: 'configRoles' },
]

export default function Config() {
  const [search, setSearch] = useState('');
  const [masters, setMasters] = useState({
    locations: [],
    plans: [],
    roles: [],
  })
  const [openDialog, setOpenDialog] = useState({ open: false, modulo: '' });

  const handleCloseDialog = () => {
    setOpenDialog({ open: false, modulo: '' });
  };

  useEffect(() => {
    configGetmasters(true)
      .then((masters) => setMasters(masters))
  }, [])
  return <Container maxWidth="xl" sx={{ mt: 2, mb: 1 }}>
    <Paper sx={{
      p: 2, mb: 1,
    }}><Grid container alignItems={'center'}>
        <Grid item xs={12} sm={4} md={2}>
          <span>Configuración</span>
        </Grid>
        <Grid item xs={12} sm={8} md={10} sx={{ textAlign: 'center' }}>
          <TextField
            label="Buscar..."
            variant="outlined"
            value={search}
            size="small"
            fullWidth
            autoComplete='off'
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              ...search && {
                endAdornment: (<>
                  <InputAdornment position="end" onClick={() => setSearch('')}>
                    <CloseIcon />
                  </InputAdornment>
                </>)
              }
            }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
      </Grid>
    </Paper>
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {configList
          .filter(({ description }) => description.toLowerCase().search(new RegExp(search.toLowerCase().trim().replace(/\s+/, '|'))) !== -1)
          .map(({ logo, title, description, modulo }, index) => <Grid item xs={12} md={6} lg={4}
            key={index}
            className='configlist'
          >
            <ListItem
              className='configlist-item'
              onClick={() => setOpenDialog({ open: true, modulo })}

            >
              <ListItemAvatar>
                <Avatar
                  alt={"logo" + index}
                  sx={{ width: 46, height: 46 }}
                >
                  {logo}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={title}
                secondary={description}
              />
            </ListItem>
          </Grid>)}
      </Grid>
    </Paper>
    <Dialog
      open={openDialog.open}
      onClose={handleCloseDialog}
      maxWidth="lg"
    >
      <DialogTitle sx={{ textTransform: 'capitalize' }}>
        {openDialog.modulo === 'configLocation' && 'Sedes'}
        {openDialog.modulo === 'configPlans' && 'Planes'}
        {openDialog.modulo === 'configRoles' && 'Roles'}
      </DialogTitle>
      <DialogContent>
        {['configLocation'].includes(openDialog.modulo) &&
          <ConfigLocation
            close={() => {
              handleCloseDialog()
              // refresh()
            }}
            locations={masters.locations}
          />
        }
        {/* 
        {openDialog.modulo === 'openInfo' &&
          <CustomerInfo
            close={() => {
              handleCloseDialog()
              refresh()
            }}
            info={openDialog.info}
            editConsumer={() => setOpenDialog({ open: true, modulo: 'editCustomer', info: openDialog.info })}
            openAssessment={(info, isEdit) => setOpenDialog({ open: true, modulo: isEdit ? 'editAssessmentForm' : 'assessmentForm', info })}
          />
        }
        {
          ['editAssessmentForm', 'assessmentForm'].includes(openDialog.modulo) &&
          <AssessmentForm
            close={() => {
              handleCloseDialog()
              refresh()
            }}
            masters={masters}
            isEdit={openDialog.modulo === 'editAssessmentForm'}
            info={openDialog.info}
          />
        } */}
      </DialogContent>
    </Dialog>
  </Container>
}