import React, { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import {
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { Avatar, Box, Button, Chip, Tab } from '@mui/material';
export default function TypeDate() {
  const [typeDate, setTypeDate] = React.useState('1');
  const [customers, setCustomers] = useState([
    { custumerId: 3, name: 'Diego Torres' },
    { custumerId: 4, name: 'Oscar de leon' },
  ]
  );
  return <div>
    <TabContext value={typeDate}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList
          centered
          onChange={(event, newValue) => {
            setTypeDate(newValue);
          }}
          aria-label="lab API tabs example"
        >
          <Tab label="Personalizado" value="1" />
          <Tab label="Grupal" value="2" />
        </TabList>
      </Box>
      <TabPanel value="1">
        <Button
          variant="outlined"
          // onClick={() => setOpenDialog({ open: true, modulo: 'addCustomer', info: {} })}
          startIcon={<PersonAddIcon />}
          sx={{ marginLeft: '10px' }}
        >
          Agregar
        </Button>
        {customers.map((customer) => <Chip
          key={customer.custumerId}
          title={customer.title}
          data-custumerId={customer.custumerId}
          variant="outlined"
          label={`${customer.name}`}
          sx={{ m: '2px 5px', }}
          avatar={<Avatar alt="Natacha" src={`https://randomuser.me/api/portraits/men/${customer.custumerId}.jpg`} />}
        />
        )}
      </TabPanel>
      <TabPanel value="2">Grupal</TabPanel>
    </TabContext>
  </div>
}