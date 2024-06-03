import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Badge, Button, Grid, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  AddAPhotoOutlined as AddAPhotoOutlinedIcon
} from '@mui/icons-material';
import ConstomerInfoBilling from './CustomerInfoBilling';
import ConstomerInfoAsist from './CustomerInfoAsist';
import CustomerAssessment from './CustomerAssessment';
import { useAuth } from '../../provider/AuthProvider';

export default function CustomerInfo({ info, editConsumer, openAssessment }) {
  const { token, authUser } = useAuth();
  return <div>
    {[1, 2, 3].includes(authUser?.roleId) && (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Información Personal
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3} alignItems={'center'}>
            <Grid item xs={12} sm={10}>
              <ListItem>
                <ListItemAvatar >
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Avatar sx={{ width: 22, height: 22, border: (theme) => `2px solid ${theme.palette.background.paper}`, }}>
                        <AddAPhotoOutlinedIcon />
                      </Avatar>
                    }
                  >
                    <Avatar
                      alt={info.customer_picture?.idFile}
                      src={info.customer_picture?.idFile
                        ? `${process.env.REACT_APP_URL_API}/${info.customer_picture.destination}/${info.customer_picture.filename}?token=${token}`
                        : `https://randomuser.me/api/portraits/${info.genderId === 1 ? 'women' : 'men'}/${info.customerId}.jpg`}
                      sx={{ width: 46, height: 46 }}
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={`${info.firstName} ${info.lastName}`}
                  secondary={`${info.billing_plan.plan} | ${info.membership_status.statusName}`}
                />
              </ListItem>
            </Grid>
            {[1, 2].includes(authUser?.roleId) && (
              <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => editConsumer()}
                >
                  Editar
                </Button>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion >
    )}
    {[1, 2].includes(authUser?.roleId) && (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          Pagos
        </AccordionSummary>
        <AccordionDetails>
          <ConstomerInfoBilling info={info} />
        </AccordionDetails>
      </Accordion>
    )}
    {[1, 2].includes(authUser?.roleId) && (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4-content"
          id="panel4-header"
        >
          Asistencias
        </AccordionSummary>
        <AccordionDetails>
          <ConstomerInfoAsist info={info} />
        </AccordionDetails>
      </Accordion>
    )}
    {[1, 2, 3].includes(authUser?.roleId) && (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          Valoraciones
        </AccordionSummary>
        <AccordionDetails>
          <CustomerAssessment
            info={info}
            open={(assessmentId, isEdit) => openAssessment(assessmentId, isEdit)}
          />
        </AccordionDetails>
      </Accordion>
    )}
  </div >
}