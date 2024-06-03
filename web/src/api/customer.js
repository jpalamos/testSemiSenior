import axios from 'axios';
export function customerGetRegister(params) {
  return new Promise((resolve, reject) => {
    axios.get("/customer/register", { params })
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}

export function customerGetMasters(params) {
  return new Promise((resolve, reject) => {
    axios.get("/customer/masters", { params })
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}

export function consumeRegister(dataForm, images, setProgressBar) {
  return new Promise((resolve, reject) => {
    if (images.length > 0) {
      const formData = new FormData();
      formData.append('dataForm', JSON.stringify(dataForm));
      for (let file of images) {
        formData.append('files', file)
      }
      axios.post("/customer", formData, {
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
      axios.post("/customer", dataForm)
        .then(response => resolve(response.data))
        .catch(err => reject(err));
    }
  });
}

export function consumerRegisterEdit(customerId, dataForm, images, setProgressBar) {
  return new Promise((resolve, reject) => {
    if (images.length > 0) {
      const formData = new FormData();
      formData.append('dataForm', JSON.stringify(dataForm));
      for (let file of images) {
        formData.append('files', file)
      }
      axios.patch("/customer/" + customerId, formData, {
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
      axios.patch("/customer/" + customerId, dataForm)
        .then(response => resolve(response.data))
        .catch(err => reject(err));
    }
  });
}

export function consumerBilling(customerId, params) {
  return new Promise((resolve, reject) => {
    axios.get("/customer/billing/" + customerId, { params })
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}

export function consumerVisit(customerId, params) {
  return new Promise((resolve, reject) => {
    axios.get("/customer/visit/" + customerId, { params })
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}

export function consumerGetAssitence(params) {
  return new Promise((resolve, reject) => {
    axios.get("/customer/assistence", { params })
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}

export function consumerSetAssitence(customerId, locationId) {
  return new Promise((resolve, reject) => {
    axios.patch("/customer/assistence/" + customerId, { locationId })
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}

export function customerCharge(customerId) {
  return new Promise((resolve, reject) => {
    axios.post("/customer/charge/" + customerId)
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}

export function customerAssessment(customerId) {
  return new Promise((resolve, reject) => {
    axios.get("/customer/assessment/" + customerId)
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}

export function consumerAssessmentAdd(customerId, dataForm, images, setProgressBar) {
  return new Promise((resolve, reject) => {
    if (images.length > 0) {
      const formData = new FormData();
      formData.append('dataForm', JSON.stringify(dataForm));
      for (let file of images) {
        formData.append('files', file)
      }
      axios.post("/customer/assessment/" + customerId, formData, {
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
      axios.post("/customer/assessment/" + customerId, dataForm)
        .then(response => resolve(response.data))
        .catch(err => reject(err));
    }
  });
}

export function consumerAssessmentEdit(assessmentId, dataForm, images, setProgressBar) {
  return new Promise((resolve, reject) => {
    if (images.length > 0) {
      const formData = new FormData();
      formData.append('dataForm', JSON.stringify(dataForm));
      for (let file of images) {
        formData.append('files', file)
      }
      axios.patch("/customer/assessment/" + assessmentId, formData, {
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
      axios.patch("/customer/assessment/" + assessmentId, dataForm)
        .then(response => resolve(response.data))
        .catch(err => reject(err));
    }
  });
}

export function customerAssessmentDeleteImg(idFile) {
  return new Promise((resolve, reject) => {
    axios.delete("/customer/assessment/img/" + idFile)
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}