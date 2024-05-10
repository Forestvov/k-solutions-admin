import { ChangeEvent, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import {nameObj} from "./data";
import { IOrderTableFilters } from '../../types/order';

// ----------------------------------------------------------------------

type Props = {
  filters: IOrderTableFilters;
  onFilters: (name: string, value: string) => void;
};


export default function OrderTableToolbar({ filters, onFilters }: Props) {
  const handleFilterModule = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters('module', event.target.value);
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
        <InputLabel>Модуль</InputLabel>

        <Select
          // @ts-ignore
          value={filters.module}
          onChange={handleFilterModule}
          input={<OutlinedInput label="Модуль" />}
          renderValue={(selected: string) => nameObj[selected]}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          <MenuItem key="home-page" value="home-page">
            <Checkbox disableRipple size="small" checked={filters.module.includes('home-page')} />
            Главная страница
          </MenuItem>
          <MenuItem key="investors-page" value="investors-page">
            <Checkbox
              disableRipple
              size="small"
              checked={filters.module.includes('investors-page')}
            />
            Ивесторам
          </MenuItem>
          <MenuItem key="personal-page" value="personal-page">
            <Checkbox
              disableRipple
              size="small"
              checked={filters.module.includes('personal-page')}
            />
            Личный кабинет
          </MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
