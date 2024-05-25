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

import { IUserTableFilters, IUserTableFilterValue } from 'src/types/user';

import { USER_STATUS } from './status-dto';
import { roleOptions } from './role-options';

// ----------------------------------------------------------------------

type Props = {
  filters: IUserTableFilters;
  onFilters: (name: string, value: IUserTableFilterValue) => void;
};

const statusOptions = [
  'Disable',
  'Enable',
  'Canceled',
  'Verified',
  'Process',
  'Not verified email',
  'Not verified YC',
];

export default function UserTableToolbar({ filters, onFilters }: Props) {
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

  const handleFilterRole = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('role', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('status', event.target.value);
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
        <InputLabel>Роль</InputLabel>

        <Select
          // @ts-ignore
          value={filters.role}
          onChange={handleFilterRole}
          input={<OutlinedInput label="Role" />}
          renderValue={(selected) => roleOptions.find((item) => item.name === selected)?.label}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          {roleOptions.map((option) => (
            <MenuItem key={option.name} value={option.name}>
              <Checkbox disableRipple size="small" checked={filters.role.includes(option.name)} />
              {option.label}
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
          value={filters.status}
          onChange={handleFilterStatus}
          input={<OutlinedInput label="Статус" />}
          renderValue={(selected) => USER_STATUS[selected]}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox disableRipple size="small" checked={filters.status.includes(option)} />
              {USER_STATUS[option]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
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
