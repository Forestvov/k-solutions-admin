import { useState, useEffect } from 'react';

import Dialog from '@mui/material/Dialog';

import axios, { endpoints } from '../../utils/axios';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  fileId: number;
};

export default function UserPhotoForm({ open, onClose, fileId }: Props) {
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    async function getPhoto() {
      const res = await axios.get(`${endpoints.user.file}/${fileId}`);
      await setPhoto(res.data.file);
    }

    if (open) {
      getPhoto();
    }
  }, [fileId, open]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={() => {
        onClose();
      }}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <img src={photo} width="100%" height="auto" alt="" />
    </Dialog>
  );
}
