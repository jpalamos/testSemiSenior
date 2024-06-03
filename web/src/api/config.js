import axios from 'axios';

export function configGetmasters(isMaster = false) {
  return new Promise((resolve, reject) => {
    axios.get("/config/masters", isMaster && { params: { isMaster } })
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}