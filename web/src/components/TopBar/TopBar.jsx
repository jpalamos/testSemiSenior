import React, { useState } from 'react'
import "./topbar.css";
import {
  NotificationsNone as NotificationsNoneIcon,
  Language as LanguageIcon,
  Settings as SettingsIcon,
  DarkModeOutlined as DarkModeOutlinedIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../provider/AuthProvider';
import { Avatar, ListItem, ListItemAvatar, ListItemText, Popover } from '@mui/material';
import logoGymmar from '../../assets/img/logo_gymmar.png';
export default function TopBar() {
  const { authUser, token, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <div className="topbar" style={{ width: '100%' }}>
      <div className="topbarWrapper">
        <div className="topLeft">
          <img src={logoGymmar} alt={"logoGymmar"} height={40} />
          <span className="logo"></span>
          <span className='middle'>
          </span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <DarkModeOutlinedIcon />
            {/* <span className="topIconBadge"></span> */}
          </div>
          <div className="topbarIconContainer">
            <NotificationsNoneIcon />
            <span className="topIconBadge">5</span>
          </div>
          <div className="topbarIconContainer">
            <LanguageIcon />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer" onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}>
            <SettingsIcon />
          </div>
          <img
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
            src={authUser.userPicture?.destination ? `${process.env.REACT_APP_URL_API}/${authUser.userPicture.destination}/${authUser.userPicture.filename}?token=${token}` : authUser.email}
            alt="avatar"
            className="topAvatar"
          />
        </div>
      </div>
      <Popover
        id={Boolean(anchorEl) ? 'simple-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => { setAnchorEl(null); }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        slotProps={{ paper: { sx: { backgroundColor: '#ff5959', } } }}
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar
              alt="profile"
              src={authUser.userPicture?.destination ? `${process.env.REACT_APP_URL_API}/${authUser.userPicture.destination}/${authUser.userPicture.filename}?token=${token}` : authUser.email}
              sx={{ width: 46, height: 46 }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={authUser.email}
            secondary={<div
              style={{ display: 'flex', color: 'white', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => logout()}
            >
              <LogoutIcon />
              <strong>Salir</strong>
            </div>}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            secondary={<div
              style={{ color: 'white', alignItems: 'center', cursor: 'pointer' }}
            // onClick={() => logout()}
            >
              <strong>Cambiar contraseña</strong>
            </div>}
          />
        </ListItem>
      </Popover>
    </div>
  );

}