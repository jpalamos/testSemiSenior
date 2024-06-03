import React, { useState } from 'react';
import { TextField, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../../../provider/AuthProvider';
import './loginPage.css';
import logoIngeniosoft from '../../../assets/img/logo_ingeniosoft.png';
import logoGymmar from '../../../assets/img/logo_gymmar.png';

const images = [
  'https://img.freepik.com/free-photo/dumbbells-floor-gym-ai-generative_123827-23743.jpg?size=626&ext=jpg&ga=GA1.1.1395880969.1709251200&semt=ais',
  'https://img.freepik.com/free-photo/strong-man-training-gym_1303-23478.jpg',
  'https://img.freepik.com/premium-photo/dumbbells-gym-flare-effect_53419-9742.jpg?w=360',
  'https://t3.ftcdn.net/jpg/04/29/35/62/360_F_429356296_CVQ5LkC6Pl55kUNLqLisVKgTw9vjyif1.jpg',
  'https://png.pngtree.com/thumb_back/fh260/background/20230613/pngtree-black-and-white-gym-room-with-a-row-of-equipment-image_2911173.jpg',
  'https://hips.hearstapps.com/hmg-prod/images/two-anonymous-fit-women-rowing-at-the-gym-royalty-free-image-1698720564.jpg?crop=1xw:0.84315xh;center,top&resize=1200:*',
  'https://t4.ftcdn.net/jpg/01/79/81/77/360_F_179817756_QzTocli57q9G6a1Oe7kJtoMS5dNMU8cl.jpg',
  'https://img.freepik.com/free-photo/low-angle-view-unrecognizable-muscular-build-man-preparing-lifting-barbell-health-club_637285-2497.jpg',
  'https://tropeaka.com/cdn/shop/articles/main_image_d517c79f-4ec7-4946-bb5e-db7e80623e85_1080x.jpg?v=1571697737',
  'https://images.contentstack.io/v3/assets/blt45c082eaf9747747/blt38cfdd480d5b5cb1/6079a6176a621f72b149f0ab/A_guide_to_gym_equipment.jpeg?format=pjpg&auto=webp&quality=76&width=1232',
  'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/06/GRT-Gym-Female-Locker-Socks-1200x628-Facebook-1-1200x628.jpg',
  'https://dynaimage.cdn.cnn.com/cnn/c_fill,g_auto,w_1200,h_675,ar_16:9/https%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F221221132301-exercise-workouts-menstrual-cycle-wellness-stock.jpg',
  'https://prod-ne-cdn-media.puregym.com/media/821398/gym-workout-plans-for-cutting.jpg?quality=80&width=992',
  'https://img.freepik.com/premium-photo/two-men-doing-exercise-with-dumbbells-bench_266732-8372.jpg',
  'https://www.collegiate-ac.com/propeller/uploads/sites/2/2023/06/gym-1024x683.jpg',
  'https://img.grouponcdn.com/iam/5MwNmnffkMsooU7ChkTeNRsRauV/5M-2048x1229/v1/c870x524.jpg',
  'https://t4.ftcdn.net/jpg/03/17/72/47/360_F_317724775_qHtWjnT8YbRdFNIuq5PWsSYypRhOmalS.jpg',
  'https://img.freepik.com/free-photo/low-angle-view-unrecognizable-muscular-build-man-preparing-lifting-barbell-health-club_637285-2497.jpg',
  'https://hips.hearstapps.com/hmg-prod/images/exercise-kettlebell-and-black-woman-in-gym-for-royalty-free-image-1704709307.jpg',
  'https://i0.wp.com/post.healthline.com/wp-content/uploads/2023/02/female-dumbbells-1296x728-header-1296x729.jpg?w=1155&h=2268',
  'https://media.istockphoto.com/id/1438034462/photo/latino-and-african-sport-woman-exercising-and-build-muscle-in-stadium-active-strong-beautiful.jpg?s=612x612&w=0&k=20&c=kFwCRkh8Q1v6uCoSTL7sQcsbk02zgSZJ1kDgnJ3DAZc=',
  'https://img.livestrong.com/375/cme-data/getty%2Ff7fe576971d849c3b9694fd349434329.jpg',
  'https://www.planetfitness.com/sites/default/files/feature-image/fitnessgirlrunningontrea_612917.jpg',
  'https://media.istockphoto.com/id/612384320/photo/curled-hair-woman-working-out-at-gym-club.jpg?s=612x612&w=0&k=20&c=EriGEQkvFvfWlpxmP2tkEHqNDjZmfEkP0ccSO15zjtQ=',
  'https://www.performancezonesports.com/cdn/shop/articles/20160229_why-all-women-need-strength-training-1140x760_1024x1024.jpg?v=1560547690'
];

const randomImage = images[Math.floor(Math.random() * images.length)];

export default function LoginPage() {
  const [dataForm, setDataForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    login(dataForm);
  };
  return (<>
    <div className='loginLogo'>
      <img src={logoIngeniosoft} alt='logo' height={80} />
    </div>
    <div
      className={'loginPage'}
      style={{ backgroundImage: `url(${randomImage})` }}
    >
      <Container
        maxWidth="xs"
        className={'formContainer'}
      >
        <img src={logoGymmar} alt={"logoGymmar"} height={100} />
        <form onSubmit={handleLogin}>
          <TextField
            autoComplete='off'
            name='email'
            label="# Documento"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            type='number'
            value={dataForm.email}
            onChange={(event) => {
              if (/^\d*$/.test(event.target.value)) {
                setDataForm((prevDataForm) => ({ ...prevDataForm, email: event.target.value }))
              }
            }}
          />
          <TextField
            name='password'
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={(event) => setDataForm((prevDataForm) => ({ ...prevDataForm, password: event.target.value }))}
            value={dataForm.password}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={Object.values(dataForm).some((value) => String(value).length < 3) || loading}
            loading={loading}
            loadingPosition="end"
            endIcon={<LoginIcon />}
          >
            Iniciar Sesión
          </LoadingButton>
        </form>
      </Container>
    </div>
  </>
  );
};
