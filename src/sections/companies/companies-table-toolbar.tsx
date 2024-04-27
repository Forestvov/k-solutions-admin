import { useState, useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { IProductTableFilters, IProductTableFilterValue } from 'src/types/product';

// ----------------------------------------------------------------------

type Props = {
  filters: IProductTableFilters;
  onFilters: (name: string, value: IProductTableFilterValue) => void;
  //
  stockOptions: {
    value: string;
    label: string;
  }[];
  publishOptions: {
    value: string;
    label: string;
  }[];
};

export default function CompaniesTableToolbar({
  filters,
  onFilters,
  //
  stockOptions,
  publishOptions,
}: Props) {
  const [stock, setStock] = useState<string[]>(filters.stock);

  const [publish, setPublish] = useState<string[]>(filters.publish);

  const handleChangeStock = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setStock(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleChangePublish = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setPublish(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleCloseStock = useCallback(() => {
    onFilters('stock', stock);
  }, [onFilters, stock]);

  const handleClosePublish = useCallback(() => {
    onFilters('publish', publish);
  }, [onFilters, publish]);

  return (
    <>
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Тип</InputLabel>

        <Select
          multiple
          value={stock}
          onChange={handleChangeStock}
          input={<OutlinedInput label="Stock" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          onClose={handleCloseStock}
          sx={{ textTransform: 'capitalize' }}
        >
          {stockOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={stock.includes(option.value)} />
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
        <InputLabel>Все</InputLabel>

        <Select
          multiple
          value={publish}
          onChange={handleChangePublish}
          input={<OutlinedInput label="Publish" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          onClose={handleClosePublish}
          sx={{ textTransform: 'capitalize' }}
        >
          {publishOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={publish.includes(option.value)} />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
