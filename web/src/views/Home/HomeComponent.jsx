import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Drawer, Toolbar, List, CssBaseline, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  SportsGymnastics as SportsGymnasticsIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  AppRegistration as AppRegistrationIcon,
  EventAvailable as EventAvailableIcon,
  SportsKabaddi as SportsKabaddiIcon,
} from '@mui/icons-material';
import Customer from '../../components/Customer/Customer';
import Register from '../../components/Register/Register';
import Dashboard from '../../components/DashBoard/DashBoard';
import TopBar from '../../components/TopBar/TopBar';
import AsistCheck from '../../components/Assistance/Assistance';
import DateEvent from '../../components/DateEvents/DateEvent';
import Config from '../../components/Config/Config';
import { useAuth } from '../../provider/AuthProvider';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const MyDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const menu = [
  [
    { pathname: 'dashboard', label: 'Dashboard', icon: <AssessmentIcon />, roleId: [1, 2, 3], component: <Dashboard /> },
  ],
  [
    { pathname: 'asistencia', label: 'Asistencia', icon: <EventAvailableIcon />, roleId: [1, 2], component: <AsistCheck /> },
    { pathname: 'citas', label: 'Citas', icon: <SportsKabaddiIcon />, roleId: [1, 2, 3], component: <DateEvent /> },
  ],
  [
    { pathname: 'clientes', label: 'Clientes', icon: <SportsGymnasticsIcon />, roleId: [1, 2, 3], component: <Customer /> },
    { pathname: 'empleados', label: 'Empleados', icon: <AppRegistrationIcon />, roleId: [1], component: <Register /> },
    { pathname: 'configuracion', label: 'Configuración', icon: <DashboardIcon />, roleId: [1], component: <Config /> },
  ]
]

export default function HomeComponent() {
  const { authUser } = useAuth();
  const theme = useTheme();
  const [openMenu, setOpenMenu] = useState(false);
  const [component, setComponent] = useState({ component: null, label: null });
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleDrawerOpen = () => {
    setOpenMenu(true);
  };

  const handleDrawerClose = () => {
    setOpenMenu(false);
  };

  const openComponent = (component) => {
    if (component) {
      setComponent({ component: component.component, label: component.label })
      navigate(component.pathname);
    }
  }

  useEffect(() => {
    const m = menu.flat().find((m) => '/' + m.pathname === pathname);
    if (m) {
      setComponent({ component: m.component, label: m.label });
    } else {
      setComponent({ component: menu[0][0].component, label: menu[0][0].label });
      navigate(menu[0][0].pathname)
    }
  }, [pathname, navigate])

  return (
    <Box sx={{ display: 'flex', overflowX: 'auto' }}>
      <CssBaseline />
      <AppBar position="fixed" open={openMenu} sx={{ background: 'linear-gradient(to right, #5965f9 0%, #764ba2 100%)' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(openMenu && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <TopBar />
        </Toolbar>
      </AppBar>
      <MyDrawer variant="permanent" open={openMenu} >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {menu?.map((menuList, index) => <List key={index}>
          {index > 0 && <Divider />}
          {menuList
            .filter(({ roleId }) => roleId && roleId.includes(authUser.roleId))
            .map((item, index) => (
              <ListItem
                key={index}
                disablePadding sx={{ display: 'block' }}
                onClick={() => openComponent(item)}
                style={item.label === component.label ? { background: 'linear-gradient(to left, #5965f9, #764ba2)', color: '#fff' } : {}}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: openMenu ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: openMenu ? 3 : 'auto',
                      justifyContent: 'center',
                      color: item.label === component.label ? '#fff' : undefined
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: openMenu ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>)}
      </MyDrawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <div style={{ maxWidth: '100vw' }} >
            {component.component}
          </div>
        </Box>
      </Box>
    </Box>
  );
}
