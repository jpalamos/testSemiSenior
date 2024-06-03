import axios from 'axios';
export function uploadGetImage(url) {
  return new Promise((resolve, reject) => {
    axios.get(url, { responseType: 'blob' })
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
}