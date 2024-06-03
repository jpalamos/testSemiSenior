import React, { useEffect, useState } from 'react';
import { Avatar, CircularProgress, FormControl, Grid, LinearProgress, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { consumerAssessmentAdd, consumerAssessmentEdit } from '../../api/customer';
import {
  //  HowToReg as HowToRegIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { DatePickerComponent } from '../commons/datePicker/datePicker';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { useAuth } from '../../provider/AuthProvider';


export default function AssessmentForm({ close, info, isEdit }) {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [progressBar, setProgressBar] = useState(15);
  const [formDataErr, setFormDataErr] = useState({});
  const [errorMessageDropzone, setErrorMessageDropzone] = useState([]);
  const [preview, setPreview] = useState([]);
  const [formData, setFormData] = useState(isEdit === true
    ? {
      attentionDate: dayjs(info.attentionDate),
      weight: info.weight ?? '',
      height: info.height ?? '',
      BMI: info.BMI ?? '',
      body_fat_percentage: info.body_fat_percentage ?? '',
      viceral_fat: info.viceral_fat ?? '',
      esquel_muscle_percentage: info.esquel_muscle_percentage ?? '',
      systole: info.systole ?? '',
      diastole: info.diastole ?? '',
      resting_heart_rate: info.resting_heart_rate ?? '',
      ideal_weight: info.ideal_weight ?? '',
      arm: info.arm ?? '',
      arm_biceps: info.arm_biceps ?? '',
      arm_triceps: info.arm_triceps ?? '',
      back: info.back ?? '',
      back_upper: info.back_upper ?? '',
      back_lower: info.back_lower ?? '',
      rib_cage: info.rib_cage ?? '',
      thoracic_fat: info.thoracic_fat ?? '',
      abdomen: info.abdomen ?? '',
      fat_rectus: info.fat_rectus ?? '',
      fat_obliques: info.fat_obliques ?? '',
      hip: info.hip ?? '',
      leg_upper: info.leg_upper ?? '',
      leg_lower: info.leg_lower ?? '',
      calf: info.calf ?? '',
      observation: info.observation ?? '',
    }
    : {
      attentionDate: dayjs(),
      weight: '',
      height: '',
      BMI: '',
      body_fat_percentage: '',
      viceral_fat: '',
      esquel_muscle_percentage: '',
      systole: '',
      diastole: '',
      resting_heart_rate: '',
      ideal_weight: '',
      arm: '',
      arm_biceps: '',
      arm_triceps: '',
      back: '',
      back_upper: '',
      back_lower: '',
      rib_cage: '',
      thoracic_fat: '',
      abdomen: '',
      fat_rectus: '',
      fat_obliques: '',
      hip: '',
      leg_upper: '',
      leg_lower: '',
      calf: '',
      observation: ''
    });
  const { acceptedFiles, isFocused, isDragActive, getRootProps, getInputProps } = useDropzone({
    maxFiles: 10,
    maxSize: 20 * 1024 * 1024,
    accept: { 'image/*': [] },
    onDropAccepted: (acceptedFiles) => {
      setErrorMessageDropzone([]);
      setPreview(prevFile => [...prevFile, ...acceptedFiles].map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })));
    },
    onDropRejected: (err) => {
      setPreview([]);
      setErrorMessageDropzone(err[0].errors);
    },
  });

  useEffect(() =>
    () => {
      preview.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [preview]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['weight', 'height', 'BMI', 'body_fat_percentage',
      'viceral_fat',
      'esquel_muscle_percentage',
      'systole',
      'diastole',
      'resting_heart_rate',
      'ideal_weight',
      'arm',
      'arm_biceps',
      'arm_triceps',
      'back',
      'back_upper',
      'back_lower',
      'rib_cage',
      'thoracic_fat',
      'abdomen',
      'fat_rectus',
      'fat_obliques',
      'hip',
      'leg_upper',
      'leg_lower',
      'calf',
    ].includes(name) && !/^\d*\.?\d+$/.test(value)) {
      return;
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setFormDataErr((prevData) => ({ ...prevData, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataFormErr = {};
    for (const [key, value] of Object.entries(formData)) {
      if (
        (['weight', 'height',].includes(key) && !(parseInt(value) > 0)) ||
        (key === 'dateOfBirth' && !value)
      ) {
        dataFormErr[key] = 'err';
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
      const send = {};
      for (const [key, value] of Object.entries(formData)) {
        if (value) send[key] = value;
      }

      setLoading(true);
      if (isEdit) {
        consumerAssessmentEdit(info.assessmentId, send, acceptedFiles, setProgressBar)
          .then((results) => close())
          .catch((err) => Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response?.data?.message,
          }))
          .finally(() => setLoading(false))
      } else {
        consumerAssessmentAdd(info.customerId, send, acceptedFiles, setProgressBar)
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
          alt={info.customer_picture.filename}
          sx={{ width: 100, height: 100 }}
          src={`${process.env.REACT_APP_URL_API}/${info.customer_picture.destination}/${info.customer_picture.filename}?token=${auth.token}`}
        />
      </div>
    }
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl
          fullWidth
          margin="normal"
        >
          <DatePickerComponent
            error={formDataErr.attentionDate === 'err'}
            label="Fecha de valoración"
            value={formData.attentionDate}
            name="attentionDate"
            disableFuture
            openTo="year"
            onChange={(dateTime) => setFormData((prevData) => ({ ...prevData, attentionDate: dateTime }))}
          />
        </FormControl>
      </Grid>
      {[
        {
          'Valoraciones': [
            { weight: 'Peso (en Kg)', height: 'Talla (en cm)', BMI: 'IMC', },
            { body_fat_percentage: '% de grasa corporal', viceral_fat: 'Grasa viceral', esquel_muscle_percentage: '% Músculo Esquelitico' },
            { systole: 'Sistole', diastole: 'Diastole', resting_heart_rate: 'Frecuencia cardíaca' },
            { ideal_weight: 'Peso ideal', }
          ]
        },
        {
          'Medidas Antropométricas': [
            { arm: 'Brazo', arm_biceps: '% Grasa biceps', arm_triceps: '% Grasa triceps', },
            { back: 'Espalda', back_upper: '% Grasa espalda alta', back_lower: '% Grasa espalda baja', },
            { rib_cage: 'Caja torácica', thoracic_fat: '% Grasa torácica', },
            { abdomen: 'Abdomen', fat_rectus: '% Grasa rectos', fat_obliques: '% Grasa oblicuos' },
            { hip: 'Cadera', leg_upper: 'Pierna alta', leg_lower: 'Pierna baja', calf: 'Pantorrilla', }
          ]
        }
      ].map((box, indexbox) => <Grid item xs={12} sm={12} md={12} key={indexbox}>{
        Object.entries(box).map(([keyBox, contentBox], indexBox1) => <div
          key={indexBox1}
          className='assesmentBox'
        >
          <strong>{keyBox}</strong>
          {contentBox.map((content, indexContent) => <div key={indexContent}
            className='assesmentContent'
          >
            <Grid container spacing={2}>
              {Object.entries(content).map(([key, value], index) => <Grid item
                xs={12} sm={6} md={4}
                key={index}
              >
                <TextField
                  label={value}
                  type='number'
                  variant="outlined"
                  autoComplete="off"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={formDataErr[key] === 'err'}
                />
              </Grid>)}
            </Grid>
          </div>)}
        </div>
        )}
      </Grid>
      )}
      <Grid item xs={12}>
        <FormControl
          fullWidth
          margin="normal"
          style={{ borderColor: errorMessageDropzone.length > 0 ? 'red' : (isFocused || isDragActive) ? '#007bff' : undefined }}
          sx={{ alignItems: 'center', border: '1px solid #cbcbcb', borderRadius: '4px', padding: '8px 0px' }}
        >
          <div {...getRootProps({ className: 'dropzone' })} style={{ textAlign: 'center' }}>
            <input {...getInputProps()} />
            {errorMessageDropzone.map(e => (
              <Typography key={e.code} color={'red'}>{
                e.code === "file-too-large"
                  ? 'La imagen o fotografía tiene más de 2MB'
                  : e.message
              }</Typography>
            ))}
            {preview.length === 0 ? <>
              <p>Arrastre y suelte las fotografía aquí, o haga clic para seleccionar archivos</p>
            </> : <>
              <div className='preview'>
                {preview.map((file, index) => (
                  <div key={`dropped_${index}`} className='dropped'>
                    {['image/jpeg', 'image/png', 'image/webp'].includes(file.type) &&
                      <img src={file.preview} alt={file.preview} style={{ maxWidth: '100%', maxHeight: '100px' }} />
                    }
                    {['video/mp4'].includes(file.type) &&
                      <video src={file.preview} playsInline webkit-playsInline alt="" />
                    }
                  </div>
                ))}
              </div>
            </>}

          </div>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <TextField
          label="Obsevaciones"
          variant="outlined"
          autoComplete="off"
          name="observation"
          value={formData.observation}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type='observation'
          error={formDataErr.observation === 'err'}
          multiline
          rows={2}
          maxRows={10}
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
      endIcon={<SaveIcon />}
    >
      {isEdit ? 'Editar' : 'Registrar'} valoración
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