import { useCallback } from 'react';

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

import { ICloseTableFilters, ICloseTableFilterValue } from 'src/types/brief';

// ----------------------------------------------------------------------

type Props = {
  filters: ICloseTableFilters;
  onFilters: (name: string, value: ICloseTableFilterValue) => void;
};

const STATUS: Record<string, string> = {
  'Order to close': 'В обработке',
  'Approved to extract': 'Одобренна',
  'Canceled to extract': 'Отклонена',
};

export default function CloseTableToolbar({ filters, onFilters }: Props) {
  const handleFilterSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('email', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('briefcaseAccountStatus', event.target.value);
    },
    [onFilters]
  );

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
        <InputLabel>Статус</InputLabel>

        <Select
          value={filters.briefcaseAccountStatus}
          onChange={handleFilterStatus}
          input={<OutlinedInput label="Статус" />}
          renderValue={(selected) => STATUS[selected]}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          {Object.keys(STATUS).map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                size="small"
                checked={filters.briefcaseAccountStatus.includes(option)}
              />
              {STATUS[option]}
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
