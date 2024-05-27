import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import SelectChangeEvent from '@mui/material/SelectChangeEvent';

import Iconify from 'src/components/iconify';

import { IUserTableFilters, IUserTableFilterValue } from 'src/types/user';
import { accountType } from './account-type';

// ----------------------------------------------------------------------

type Props = {
  filters: IUserTableFilters;
  onFilters: (name: string, value: IUserTableFilterValue) => void;
};

export default function UserVerificationTableToolbar({ filters, onFilters }: Props) {
  const handleFilterSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('email', event.target.value);
    },
    [onFilters]
  );

  const handleFilterFam = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('fam', event.target.value);
    },
    [onFilters]
  );

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterAccountType = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('accountTypeName', event.target.value);
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
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Тип Аккаунта</InputLabel>

          <Select
            // @ts-ignore
            value={filters.accountTypeName}
            onChange={handleFilterAccountType}
            input={<OutlinedInput label="Тип Аккаунта" />}
            renderValue={(selected) => accountType.find((type) => type.name === selected)?.label}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {accountType.map((option) => (
              <MenuItem key={option.name} value={option.name}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.accountTypeName.includes(option.name)}
                />
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          value={filters.fam}
          onChange={handleFilterFam}
          placeholder="Поиск по фамилии"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          value={filters.name}
          onChange={handleFilterName}
          placeholder="Поиск по имени"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

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
