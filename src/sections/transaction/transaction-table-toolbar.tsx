import { ChangeEvent, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Iconify from 'src/components/iconify';

import { TransactionType, ITransactionTableFilters } from '../../types/transaction';

// ----------------------------------------------------------------------

type Props = {
  filters: ITransactionTableFilters;
  onFilters: (name: string, value: string) => void;
};

const transactionTypeOptions = ['In', 'Out'];
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

export default function TransactionTableToolbar({ filters, onFilters }: Props) {
  const handleFilterSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onFilters('email', event.target.value);
    },
    [onFilters]
  );

  const handleFilterTransactionType = useCallback(
    (event: SelectChangeEvent<TransactionType>) => {
      onFilters('transactionType', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('transactionStatus', event.target.value);
    },
    [onFilters]
  );

  const handleFilterTypePay = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('transactionLinkType', event.target.value);
    },
    [onFilters]
  );

  // @ts-ignore
  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Тип транзакции</InputLabel>

        <Select
          // @ts-ignore
          value={filters.transactionType}
          onChange={handleFilterTransactionType}
          input={<OutlinedInput label="Тип транзакции" />}
          renderValue={(selected: TransactionType) => (selected === 'In' ? 'Пополнение' : 'Вывод')}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          {transactionTypeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                size="small"
                checked={filters.transactionType.includes(option)}
              />
              {option === 'In' ? 'Пополнение' : 'Вывод'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Платежная система</InputLabel>

        <Select
          // @ts-ignore
          value={filters.transactionLinkType}
          onChange={handleFilterTypePay}
          input={<OutlinedInput label="Платежная система" />}
          renderValue={(selected) => methodPay[selected]}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          {Object.keys(methodPay).map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                size="small"
                checked={filters.transactionLinkType.includes(option)}
              />
              {methodPay[option]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Статус</InputLabel>

        <Select
          // @ts-ignore
          value={filters.transactionStatus}
          onChange={handleFilterStatus}
          input={<OutlinedInput label="Статус" />}
          renderValue={(selected) => status[selected]}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          {Object.keys(status).map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                size="small"
                checked={filters.transactionStatus.includes(option)}
              />
              {status[option]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.email}
          onChange={handleFilterSearch}
          placeholder="Поиск по e-mail"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Stack>
  );
}
