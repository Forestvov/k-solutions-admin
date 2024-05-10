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
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { ITransaction } from '../../types/transaction';
import { updateTransaction } from '../../api/transaction';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  updateTable: VoidFunction;
  currentTransaction?: ITransaction;
};

const STATUS = [
  { value: 'Canceled', label: 'Отклонена' },
  { value: 'Success', label: 'Одобренна' },
  { value: 'Process', label: 'В обработке' },
];

export default function OrderQuickEditForm({
  currentTransaction,
  open,
  onClose,
  updateTable,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewTransactionSchema = Yup.object().shape({
    transactionId: Yup.number(),
    transactionType: Yup.string(),
    oldAmount: Yup.number(),
    transactionStatus: Yup.string().required('Заполните поле'),
    amount: Yup.number().required('Заполните поле'),
  });

  const methods = useForm({
    // @ts-ignore
    resolver: yupResolver(NewTransactionSchema),
  });

  useEffect(() => {
    methods.setValue('transactionId', currentTransaction?.transactionId || 99999999);
    methods.setValue('transactionType', currentTransaction?.transactionType || '');
    methods.setValue('transactionStatus', currentTransaction?.transactionStatus || '');
    methods.setValue('oldAmount', currentTransaction?.amount || 0);
    methods.setValue('amount', currentTransaction?.amount || 0);
  }, [currentTransaction, methods]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTransaction?.transactionId) {
        await updateTransaction(data);
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
            <RHFSelect name="transactionStatus" label="Статус">
              {STATUS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField name="amount" label="Сумма" />
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
