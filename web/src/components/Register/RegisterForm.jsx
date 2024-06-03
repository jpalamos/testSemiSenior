import React, { useState } from 'react';
import { HexColorPicker } from "react-colorful";
import { useDropzone } from 'react-dropzone';
import { Avatar, CircularProgress, FormControl, InputLabel, LinearProgress, MenuItem, Select, TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { HowToReg as HowToRegIcon } from '@mui/icons-material';
import { authRegister, authRegisterEdit } from '../../api/auth';
import Swal from 'sweetalert2'
import { useAuth } from '../../provider/AuthProvider';


export default function RegisterForm({ masters, close, isEdit, isAdmin, info }) {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [progressBar, setProgressBar] = useState(15);
  const [color, setColor] = useState(isEdit ? info.users_personal_info?.color ?? "#FFF" : "#FFF");
  const [errorMessageDropzone, setErrorMessageDropzone] = useState([]);
  const [preview, setPreview] = useState(null);
  const { acceptedFiles, isFocused, isDragActive, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    accept: { 'image/*': [] },
    onDropAccepted: (acceptedFiles) => {
      setErrorMessageDropzone([]);
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    },
    onDropRejected: (err) => {
      setPreview(null);
      setErrorMessageDropzone(err[0].errors);
    },
  });
  const [formData, setFormData] = useState(isEdit
    ? {
      identityCard: info.users_personal_info?.identityCard ?? '',
      firstName: info.users_personal_info?.firstName ?? '',
      firstLastName: info.users_personal_info?.firstLastName ?? '',
      roleId: info.roleId,
      location: info.users_locations?.map(({ locationId }) => locationId) ?? [],
    }
    : {
      identityCard: '',
      firstName: '',
      firstLastName: '',
      roleId: 0,
      location: [],
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === 'identityCard' && !/^\d*$/.test(value)) ||
      (['firstName', 'firstLastName'].includes(name) && !/(^$)|(^[a-zA-Z]+(\s?|(\s+[a-zA-Z]+))?$)/.test(value))
    ) {
      return;
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (isEdit) {
      authRegisterEdit(info.userId, { ...formData, color }, acceptedFiles, setProgressBar)
        .then((results) => close())
        .catch((err) => Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response?.data?.message,
        }))
        .finally(() => setLoading(false))
    } else {
      authRegister({ ...formData, color }, acceptedFiles, setProgressBar)
        .then((results) => close())
        .catch((err) => Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response?.data?.message,
        }))
        .finally(() => setLoading(false))
    }
  };
  return <form onSubmit={handleSubmit}>
    {isEdit && info.user_picture?.filename &&
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Avatar
          alt="Remy Sharp"
          sx={{ width: 100, height: 100 }}
          src={`${process.env.REACT_APP_URL_API}/${info.user_picture.destination}/${info.user_picture.filename}?token=${auth.token}`}
        />
      </div>
    }
    <TextField
      label="Documento"
      variant="outlined"
      autoComplete="off"
      name="identityCard"
      value={formData.identityCard}
      onChange={handleChange}
      fullWidth
      margin="normal"
      type="text"
      pattern="[0-9]*"
      disabled={isEdit}
    />
    <TextField
      label="Nombre(s)"
      variant="outlined"
      autoComplete="off"
      name="firstName"
      value={formData.firstName}
      onChange={handleChange}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Apellido(s)"
      variant="outlined"
      autoComplete="off"
      name="firstLastName"
      value={formData.firstLastName}
      onChange={handleChange}
      fullWidth
      margin="normal"
    />
    {isAdmin !== true && <>
      <FormControl fullWidth margin="normal">
        <InputLabel id="rol-select-label">Rol</InputLabel>
        <Select
          labelId="rol-select-label"
          id="rol-select"
          label="Rol"
          name="roleId"
          value={formData.roleId}
          onChange={handleChange}
          disabled={isEdit}
        >
          {masters.roles.map(({ roleId, description }) => (
            <MenuItem key={roleId} value={roleId}>
              {description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="location-label">Sede</InputLabel>
        <Select
          labelId="location-s-label"
          id="location"
          label="Sede"
          name="location"
          multiple
          value={formData.location}
          onChange={handleChange}
          variant="outlined"
          renderValue={(selected) => masters.locations.filter(({ locationId }) => selected.includes(locationId)).map(({ location }) => location).join(', ')}
        >
          {masters.locations.map(({ locationId, location }) => (
            <MenuItem key={locationId} value={locationId}>
              {location}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>}
    <FormControl
      fullWidth
      margin="normal"
      style={{ borderColor: errorMessageDropzone.length > 0 ? 'red' : (isFocused || isDragActive) ? '#007bff' : undefined }}
      sx={{ alignItems: 'center', border: '1px solid #cbcbcb', borderRadius: '4px', padding: '8px 0px' }}
    >

      {preview && <InputLabel id="photo-label">Imagen</InputLabel>}
      <div {...getRootProps({ className: 'dropzone' })} style={{ textAlign: 'center' }}>
        <input {...getInputProps()} />
        {errorMessageDropzone.map(e => (
          <Typography key={e.code} color={'red'}>{
            e.code === "file-too-large"
              ? 'La imagen o fotografía tiene más de 2MB'
              : e.message
          }</Typography>
        ))}
        {preview
          ? <img src={preview} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '100px' }} />
          : <p>Arrastre y suelte una fotografía aquí, o haga clic para seleccionar archivos</p>
        }
      </div>
    </FormControl>
    <FormControl fullWidth margin="normal" sx={{ alignItems: 'center', border: '1px solid #cbcbcb', borderRadius: '4px', padding: '8px 0px' }}>
      <InputLabel htmlFor="color" style={{ borderRightColor: color }} sx={{
        borderRight: '70px solid #000',
        paddingRight: '10px',
      }}>
        Color:
      </InputLabel>
      <HexColorPicker
        color={color}
        onChange={setColor}
      />
    </FormControl>
    <LoadingButton
      type="submit"
      variant="contained"
      color="primary"
      disabled={
        loading
        || (!isEdit && acceptedFiles.length < 1)
        || Object.entries(formData).some(([key, value]) =>
          key === 'location'
            ? isAdmin !== true && value.length < 1
            : key === 'roleId'
              ? isAdmin !== true && value < 2
              : (!value || String(value).length < 3))
      }
      fullWidth
      loading={loading}
      loadingPosition="end"
      endIcon={<HowToRegIcon />}
    >
      {isEdit ? 'Editar' : 'Registrar'}
    </LoadingButton>
    {loading && <>
      <LinearProgress variant="determinate" value={progressBar} sx={{ mt: 2 }} />
      <div style={{ textAlign: 'center' }}>
        <CircularProgress size={11} />
        <span> Progreso {progressBar}%</span>
      </div>
    </>}

  </form>
} 