import axios from 'axios';

export default function runDefaultApi({ logout }) {
  axios.defaults.baseURL = process.env.REACT_APP_URL_API
  axios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  });
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );
}