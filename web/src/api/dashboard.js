import axios from 'axios';
export function dashboardGetAll(params) {
  return new Promise((resolve, reject) => {
    axios.get("/dahboard", { params })
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}