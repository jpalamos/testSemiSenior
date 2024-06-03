import axios from 'axios';

export function authLogin(dataLogin) {
  return new Promise((resolve, reject) => {
    axios.post("/auth/login", dataLogin)
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}

export function authRegister(dataForm, images, setProgressBar) {
  return new Promise((resolve, reject) => {
    if (images.length > 0) {
      const formData = new FormData();
      formData.append('dataForm', JSON.stringify(dataForm));
      for (let file of images) {
        formData.append('files', file)
      }
      axios.post("/auth/register", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (setProgressBar) {
            const { loaded, total } = progressEvent;
            setProgressBar(Math.floor((loaded * 100) / total));
          }
        }
      })
        .then(res => resolve(res.data))
        .catch(err => reject(err));

    } else {
      axios.post("/auth/register", dataForm)
        .then(response => resolve(response.data))
        .catch(err => reject(err));
    }
  });
}

export function authRegisterEdit(userId, dataForm, images, setProgressBar) {
  return new Promise((resolve, reject) => {
    if (images.length > 0) {
      const formData = new FormData();
      formData.append('dataForm', JSON.stringify(dataForm));
      for (let file of images) {
        formData.append('files', file)
      }
      axios.patch("/auth/register/" + userId, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (setProgressBar) {
            const { loaded, total } = progressEvent;
            setProgressBar(Math.floor((loaded * 100) / total));
          }
        }
      })
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    } else {
      axios.patch("/auth/register/" + userId, dataForm)
        .then(response => resolve(response.data))
        .catch(err => reject(err));
    }
  });
}

export function authGetRegister(params) {
  return new Promise((resolve, reject) => {
    axios.get("/auth/register", { params })
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}
export function authGetTrainers() {
  return new Promise((resolve, reject) => {
    axios.get("/auth/trainers")
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}