import React, { useState } from 'react';
import { Avatar, Button, CircularProgress, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Select, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { consumeRegister, consumerRegisterEdit } from '../../api/customer';
import { HowToReg as HowToRegIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { DatePickerComponent } from '../commons/datePicker/datePicker';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { useAuth } from '../../provider/AuthProvider';


export default function CustomerForm({ masters, close, closeEdit, info, isEdit }) {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [progressBar, setProgressBar] = useState(15);
  const [formDataErr, setFormDataErr] = useState({});
  const [errorMessageDropzone, setErrorMessageDropzone] = useState([]);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState(isEdit === true
    ? {
      identityCard: info.identityCard,
      firstName: info.firstName,
      lastName: info.lastName,
      planId: info.planId + '',
      dateOfBirth: dayjs(info.dateOfBirth),
      email: info.email,
      phoneNumber: info.phoneNumber,
      address: info.address,
      genderId: info.genderId + '',
      sexualOrientationId: info.sexualOrientationId + '',
    }
    : {
      identityCard: '',
      firstName: '',
      lastName: '',
      planId: '',
      dateOfBirth: '',
      email: '',
      phoneNumber: '',
      address: '',
      genderId: '',
      sexualOrientationId: '',
    });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      (['identityCard', 'phoneNumber', 'emergencyContactPhone'].includes(name) && !/^\d*$/.test(value)) ||
      (['firstName', 'lastName'].includes(name) && !/(^$)|(^[a-zA-Z]+(\s?|(\s+[a-zA-Z]+))?$)/.test(value))
    ) {
      return;
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setFormDataErr((prevData) => ({ ...prevData, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataFormErr = {};
    for (const [key, value] of Object.entries(formData)) {
      if (!['dateOfBirth', 'planId', 'genderId', 'sexualOrientationId'].includes(key)) {
        if ((!value || String(value).length < 3)) {
          dataFormErr[key] = 'err';
        }
      } else {
        if (
          (['planId', 'genderId', 'sexualOrientationId'].includes(key) && !(parseInt(value) > 0)) ||
          (key === 'dateOfBirth' && !value)
        ) {
          dataFormErr[key] = 'err';
        }
      }
    }
    setFormDataErr(dataFormErr);
    if (Object.values(dataFormErr).length > 0) {
      Swal.fire({
        icon: "warning",
        title: "",
        text: 'Faltan campos por tramitar',
      })
    } else {
      setLoading(true);
      if (isEdit) {
        consumerRegisterEdit(info.customerId, formData, acceptedFiles, setProgressBar)
          .then((results) => closeEdit())
          .catch((err) => Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response?.data?.message,
          }))
          .finally(() => setLoading(false))
      } else {
        consumeRegister(formData, acceptedFiles, setProgressBar)
          .then((results) => close())
          .catch((err) => Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response?.data?.message,
          }))
          .finally(() => setLoading(false))
      }
    }
  };
  return <form onSubmit={handleSubmit}>
    {isEdit && info.customer_picture?.idFile &&
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Avatar
          alt="Remy Sharp"
          sx={{ width: 100, height: 100 }}
          src={`${process.env.REACT_APP_URL_API}/${info.customer_picture.destination}/${info.customer_picture.filename}?token=${auth.token}`}
        />
      </div>
    }
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={3}>
        <FormControl
          fullWidth
          margin="normal"
          error={formDataErr.planId === 'err'}
        >
          <InputLabel id="plans-select-label">Plan</InputLabel>
          <Select
            labelId="plans-select-label"
            id="plans-select"
            label="Plan"
            name="planId"
            value={formData.planId}
            onChange={handleChange}
          >
            {masters.plans.map(({ planId, plan }) => (
              <MenuItem key={planId} value={String(planId)}>
                {plan}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3} >
        <TextField
          label="Nombre(s)"
          variant="outlined"
          autoComplete="off"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={formDataErr.firstName === 'err'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} >
        <TextField
          label="Apellido(s)"
          variant="outlined"
          autoComplete="off"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={formDataErr.lastName === 'err'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          label="# Documento"
          variant="outlined"
          autoComplete="off"
          name="identityCard"
          value={formData.identityCard}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="text"
          pattern="[0-9]*"
          error={formDataErr.identityCard === 'err'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FormControl
          fullWidth
          margin="normal"
        >
          <DatePickerComponent
            error={formDataErr.dateOfBirth === 'err'}
            label="Fecha de nacimiento"
            value={formData.dateOfBirth}
            name="dateOfBirth"
            disableFuture
            openTo="year"
            onChange={(dateTime) => setFormData((prevData) => ({ ...prevData, dateOfBirth: dateTime }))}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Email"
          variant="outlined"
          autoComplete="off"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type='email'
          error={formDataErr.email === 'err'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="# Celular"
          variant="outlined"
          autoComplete="off"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={formDataErr.phoneNumber === 'err'}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TextField
          label="Dirección de residencia"
          variant="outlined"
          autoComplete="off"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={formDataErr.address === 'err'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} >
        <FormControl
          fullWidth
          margin="normal"
          error={formDataErr.genderId === 'err'}
        >
          <InputLabel id="gender-select-label">Sexo</InputLabel>
          <Select
            labelId="gender-select-label"
            id="gender-select"
            label="Sexo"
            name="genderId"
            value={formData.genderId}
            onChange={handleChange}
          >
            {masters.genders.map(({ genderId, gender }) => (
              <MenuItem key={genderId} value={String(genderId)}>
                {gender}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl
          fullWidth
          margin="normal"
          error={formDataErr.sexualOrientationId === 'err'}
        >
          <InputLabel id="sexualOrientations-select-label">Orientación sexual</InputLabel>
          <Select
            labelId="sexualOrientations-select-label"
            id="sexualOrientations-select"
            label="Orientación sexual"
            name="sexualOrientationId"
            value={formData.sexualOrientationId}
            onChange={handleChange}
          >
            {masters.sexualOrientations.map(({ sexualOrientationId, orientation }) => (
              <MenuItem key={sexualOrientationId} value={String(sexualOrientationId)}>
                {orientation}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl
          fullWidth
          margin="normal"
          style={{ borderColor: errorMessageDropzone.length > 0 ? 'red' : (isFocused || isDragActive) ? '#007bff' : undefined }}
          sx={{ alignItems: 'center', border: '1px solid #cbcbcb', borderRadius: '4px', padding: '8px 0px' }}
        >
          {preview && <InputLabel id="photo-label" >Avatar {isEdit ? 'nuevo' : ''}</InputLabel>}
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
          {isEdit && preview && <Button
            size="small"
            variant="outlined"
            style={{ textTransform: 'none' }}
            onClick={() => {
              setPreview(null);
              acceptedFiles.splice(0, acceptedFiles.length)
            }}
          >
            Cancelar avatar nuevo
          </Button>}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TextField
          label="Nombre contacto de emergencia"
          variant="outlined"
          autoComplete="off"
          name="emergencyContactName"
          value={formData.emergencyContactName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={formDataErr.emergencyContactName === 'err'}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TextField
          label="# contacto de emergencia"
          variant="outlined"
          autoComplete="off"
          name="emergencyContactPhone"
          value={formData.emergencyContactPhone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={formDataErr.emergencyContactPhone === 'err'}
        />
      </Grid>
    </Grid>
    <LoadingButton
      type="submit"
      variant="contained"
      color="primary"
      disabled={loading}
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
  </form >
} 