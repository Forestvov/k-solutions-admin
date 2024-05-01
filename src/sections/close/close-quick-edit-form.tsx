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
import {IBrief} from "../../types/brief";
import {updateBrief} from "../../api/brief";

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  updateTable: VoidFunction;
  current?: IBrief;
};

const STATUS = [
  { value: 'Process', label: 'В обработке' },
  { value: 'Approved', label: 'Одобренна' },
  { value: 'Canceled', label: 'Отклонена' },
];

export default function CloseQuickEditForm({ current, open, onClose, updateTable }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    briefcaseAccountOrderToCloseStatus: Yup.string().required('Заполните поле'),
  });

  const methods = useForm({
    // @ts-ignore
    resolver: yupResolver(NewUserSchema),
  });

  useEffect(() => {
    methods.setValue('briefcaseAccountOrderToCloseStatus', current?.briefcaseAccountOrderToCloseStatus || '');
  }, [current, methods]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (current?.briefcaseAccountId) {
        await updateBrief(current.briefcaseAccountId, data.briefcaseAccountOrderToCloseStatus)
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
          <Box
            sx={{
              paddingTop: '15px'
            }}
            rowGap={3}
            columnGap={2}
          >
            <RHFSelect name="briefcaseAccountOrderToCloseStatus" label="Статус">
              {STATUS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />
          </Box>
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
