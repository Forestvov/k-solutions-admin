import * as Yup from 'yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { IOrder } from 'src/types/order';

import { orderStatus } from './order-status';
import { updateOrder } from '../../api/order';
import FormProvider, { RHFSelect } from '../../components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  updateTable: VoidFunction;
  currentOrder?: IOrder;
};

export const OrderQuickEditForm = ({ updateTable, open, onClose, currentOrder }: Props) => {
  const NewUserSchema = Yup.object().shape({
    status: Yup.string().required('Заполните поле'),
  });

  const methods = useForm({
    // @ts-ignore
    resolver: yupResolver(NewUserSchema),
  });

  useEffect(() => {
    methods.setValue('status', currentOrder?.status || '');
  }, [currentOrder, methods]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentOrder?.id) {
        await updateOrder(currentOrder.id);
        updateTable();
        reset();
        onClose();
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
          <Box padding={1} />

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFSelect name="status" label="Статус">
              {Object.keys(orderStatus).map((key) => (
                <MenuItem key={key} value={key}>
                  {
                    // @ts-ignore
                    orderStatus[key]
                  }
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
};
