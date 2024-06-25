import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';

import Iconify from 'src/components/iconify';

import { ITransactionTableFilters } from '../../types/transaction';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: ITransactionTableFilters;
  onFilters: (name: string, value: string) => void;
  onResetFilters: VoidFunction;
  results: number;
};

const status: Record<string, string> = {
  Canceled: 'Отклонена',
  Success: 'Одобренна',
  Process: 'В обработке',
  Hidden: 'Скрытый',
};
const methodPay: Record<string, string> = {
  Visa: 'Visa',
  Token: 'Token',
  p2p: 'p2p',
};

export default function TransactionTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}: Props) {
  const handleRemoveTransaction = useCallback(() => {
    onFilters('transactionType', '');
  }, [onFilters]);

  const handleRemoveStatus = useCallback(() => {
    onFilters('transactionStatus', '');
  }, [onFilters]);

  const handleRemoveTypePay = useCallback(() => {
    onFilters('transactionLinkType', '');
  }, [onFilters]);

  if (
    !filters.transactionType.length &&
    !filters.transactionStatus.length &&
    !filters.transactionLinkType.length
  ) {
    return null;
  }

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          результатов найдено
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.transactionType.length && (
          <Block label="Тип транзакции:">
            <Chip
              key={filters.transactionType}
              label={filters.transactionType === 'In' ? 'Пополнение' : 'Вывод'}
              size="small"
              onDelete={handleRemoveTransaction}
            />
          </Block>
        )}

        {!!filters.transactionStatus.length && (
          <Block label="Статус:">
            <Chip
              key={filters.transactionStatus}
              label={status[filters.transactionStatus]}
              size="small"
              onDelete={handleRemoveStatus}
            />
          </Block>
        )}

        {!!filters.transactionLinkType.length && (
          <Block label="Платежная система:">
            <Chip
              key={filters.transactionLinkType}
              label={methodPay[filters.transactionLinkType]}
              size="small"
              onDelete={handleRemoveTypePay}
            />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Очистить
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
