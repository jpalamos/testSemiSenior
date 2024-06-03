import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Avatar, ListItem, ListItemAvatar, ListItemText, CircularProgress, Popover } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import weightLogo from '../../assets/svg/body-mass-index-svgrepo-com.svg';
import heightLogo from '../../assets/svg/x-ray-skeleton-svgrepo-com.svg';
import BMILogo from '../../assets/svg/report-health-svgrepo-com.svg';
import { useAuth } from '../../provider/AuthProvider';

import { customerAssessment, customerAssessmentDeleteImg } from '../../api/customer';

export default function CustomerAssessment({ info, open }) {
  const { token } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [imgOver, setImgOver] = useState({});
  const [loading, setLoading] = useState(false);
  const [assessments, setAssessments] = useState([]);

  const refresh = useCallback(() => {
    setLoading(true);
    customerAssessment(info.customerId)
      .then((results) => {
        setAssessments(results)
      })
      .catch((err) => Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message,
      }))
      .finally(() => setLoading(false))
  }, [info.customerId]);

  useEffect(() => {
    refresh();
  }, [refresh, info.customerId]);

  return <Grid container spacing={3} sx={{ p: 2, overflow: 'hidden', justifyContent: 'center' }}>
    {assessments.map(({ assessmentId, assessment_pictures, user, attentionDate, weight, height, BMI, ...rest }, index) => <Grid
      key={assessmentId}
      item
      xs={12} sm={6} md={5}
      style={{ padding: '4px 6px' }}
      sx={{ cursor: 'pointer', }}
    >
      <div className='assessmentItem'>
        <div
          onClick={() => open({ customerId: info.customerId, assessmentId, attentionDate, weight, height, BMI, ...rest }, true)}
        >
          <ListItem>
            <ListItemAvatar >
              <Avatar>{index + 1}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={dayjs(attentionDate).locale('es').format('YYYY-MMMM-DD')}
              secondary={`Por: ${user.users_personal_info?.firstName ?? ''} ${user.users_personal_info?.firstLastName ?? ''}`}
            />
          </ListItem>
          <div className='assessmentItemMetric'>
            <div>
              <img src={weightLogo} alt={"weightLogo" + index} height={30} />
              <span>{weight}Kg</span>
            </div>
            <div>
              <img src={heightLogo} alt={"heightLogo" + index} height={30} />
              <span>{height}cm</span>
            </div>
            {BMI && <div>
              <img src={BMILogo} alt={"BMILogo" + index} height={30} />
              <span>{BMI}</span>
            </div>
            }
          </div>
        </div>
        <Swiper
          slidesPerView={'auto'}
          centeredSlides={true}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {assessment_pictures.map(({ idFile, destination, filename }) =>
            <SwiperSlide>
              <img
                onClick={(event) => {
                  setAnchorEl(event.currentTarget);
                  setImgOver({ idFile, destination, filename })
                }}
                alt={idFile}
                src={`${process.env.REACT_APP_URL_API}/${destination}/${filename}?token=${token}`} height={150}
              />
            </SwiperSlide>)}
        </Swiper>
        <Popover
          id={Boolean(anchorEl) ? 'simple-popover' : undefined}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => { setAnchorEl(null); }}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          slotProps={{ paper: { sx: { backgroundColor: '#ff5959', } } }}
        >
          <img
            alt={imgOver.idFile}
            src={`${process.env.REACT_APP_URL_API}/${imgOver.destination}/${imgOver.filename}?token=${token}`}
            style={{ maxWidth: '100vw', maxHeight: '350px' }}
          />
          <div style={{ textAlign: 'center' }}>
            {!loading
              ? <DeleteForeverIcon
                style={{ cursor: 'pointer', color: 'white' }}
                onClick={() => Swal.fire({
                  title: "Esta seguro?",
                  text: `Esta eliminación no se puede deshacer`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#1976d2cc",
                  cancelButtonColor: "#ff5959",
                  confirmButtonText: "Si, estoy seguro!",
                  cancelButtonText: "Cancelar"
                }).then((result) => {
                  if (result.isConfirmed) {
                    setLoading(true);
                    customerAssessmentDeleteImg(imgOver.idFile)
                      .then((charged) => {
                        setAnchorEl(null)
                        refresh();
                        Swal.fire({
                          title: "La imagen se ha eliminado con exito!",
                          text: "",
                          icon: "success"
                        })
                      })
                      .catch((err) => Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response?.data?.message,
                      }))
                      .finally(() => setLoading(false))
                  }
                })}
              />
              : <div style={{ color: 'white' }}>
                <CircularProgress size={20} sx={{ color: 'white', marginRight: '5px' }} />
                <div><span>Procesando...</span></div>
              </div>
            }

          </div>
        </Popover>
      </div>
    </Grid>
    )}
    <Grid
      item
      className='assessmentItem'
      style={{ padding: '4px 6px' }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        color: '#4a26b7',
        border: '1px solid #4a26b7'
      }}
      onClick={() => open({ customerId: info.customerId }, false)}
    >
      <div style={{ textAlign: 'center' }}>
        <div>Nueva</div>
        <div>valoración</div>
        {loading && <CircularProgress size={15} />}
      </div>
    </Grid>
  </Grid>
}