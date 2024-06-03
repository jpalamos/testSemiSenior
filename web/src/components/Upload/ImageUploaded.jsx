import React, { useEffect, useState } from 'react';
import { Avatar, CircularProgress } from '@mui/material';
import { uploadGetImage } from '../../api/upload';
export default function ImageUploaded({ isAvatar, imageUrl, width, height }) {
  const [imageData, setImageData] = useState(null);
  useEffect(() => {
    const loadImage = () => {
      if (imageUrl)
        uploadGetImage(imageUrl)
          .then((image) => setImageData(URL.createObjectURL(image)))
          .catch((err) => console.error('Error loading image:', err))
    };
    loadImage();
    return () => {
      URL.revokeObjectURL(imageData);
    };
  }, [imageUrl]);

  return (<>
    {imageData
      ? isAvatar
        ? <Avatar
          alt="Avatar"
          src={imageData}
          sx={{ ml: '4px', width: width ?? '24px', height: height ?? '24px' }}
        />
        : <img src={imageData} alt="Loaded" style={{ width: width ?? '24px', height: height ?? '24px' }} />
      : imageUrl && <CircularProgress size={20} />
    }
  </>
  );
}