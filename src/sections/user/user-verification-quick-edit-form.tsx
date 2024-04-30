import * as Yup from 'yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect } from 'src/components/hook-form';

import { IUser } from '../../types/user';
import { updateUser } from '../../api/user';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  updateTable: VoidFunction;
  currentUser?: IUser;
};


const USER_STATUS = [
  { value: 'Not verified YC', label: 'Нет запроса на верификацию' },
  { value: 'Not verified email', label: 'Почта не подтверждена' },
  { value: 'Process', label: 'В обработке' },
  { value: 'Verified', label: 'Верефицирован' },
  { value: 'Canceled', label: 'Отменен' },
  { value: 'Enable', label: 'Доступен' },
  { value: 'Disable', label: 'Заблокирован' },
];

export default function UserVerificationQuickEditForm({ currentUser, open, onClose, updateTable }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    status: Yup.string().required('Заполните поле'),
  });

  const methods = useForm({
    // @ts-ignore
    resolver: yupResolver(NewUserSchema),
  });

  useEffect(() => {
    methods.setValue('status', currentUser?.status || '');
  }, [currentUser, methods]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentUser?.accountId) {
        await updateUser({
          ...data,
          accountId: currentUser.accountId,
        });
        updateTable();
        reset();
        onClose();
        enqueueSnackbar('Update success!');
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Обновить данные</DialogTitle>

        <DialogContent>
          {currentUser?.status !== 'Verified' ? (
            <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
              Аккаунт ожидает подтверждения
            </Alert>
          ) : (
            <Box padding={1} />
          )}

          <RHFSelect name="status" label="Статус">
            {USER_STATUS.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </RHFSelect>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              onClose();
              reset();
            }}
          >
            Закрыть
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Обновить
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
