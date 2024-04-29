import { useState, useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import getLabel from './get-label';
import { CompanyType, ICompanyTableFilters } from '../../types/company';

// ----------------------------------------------------------------------

type Props = {
  filters: ICompanyTableFilters;
  onFilters: (name: string, value: string) => void;
};

const companyOptions: CompanyType[] = ['Franchise', 'Company'];
const publishOptions = ['published', 'ker'];

export default function CompaniesTableToolbar({ filters, onFilters }: Props) {
  const [publish, setPublish] = useState<string>(filters.briefcaseStatus);

  const handleChangeCompany = useCallback(
    (event: SelectChangeEvent<CompanyType>) => {
      onFilters('companytype', event.target.value);
    },
    [onFilters]
  );

  const handleChangePublish = useCallback((event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;
    setPublish(value);
  }, []);

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
          // @ts-ignore
          value={filters.companytype}
          onChange={handleChangeCompany}
          input={<OutlinedInput label="Тип" />}
          renderValue={(selected) => getLabel(selected)}
          sx={{ textTransform: 'capitalize' }}
        >
          {companyOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox disableRipple size="small" checked={filters.companytype.includes(option)} />
              {getLabel(option)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* <FormControl */}
      {/*  sx={{ */}
      {/*    flexShrink: 0, */}
      {/*    width: { xs: 1, md: 200 }, */}
      {/*  }} */}
      {/* > */}
      {/*  <InputLabel>Все</InputLabel> */}

      {/*  <Select */}
      {/*    value={publish} */}
      {/*    onChange={handleChangePublish} */}
      {/*    input={<OutlinedInput label="Publish" />} */}
      {/*    renderValue={(selected) => selected} */}
      {/*    onClose={handleClosePublish} */}
      {/*    sx={{ textTransform: 'capitalize' }} */}
      {/*  > */}
      {/*    {publishOptions.map((option) => ( */}
      {/*      <MenuItem key={option.value} value={option.value}> */}
      {/*        <Checkbox disableRipple size="small" checked={publish.includes(option.value)} /> */}
      {/*        {option.label} */}
      {/*      </MenuItem> */}
      {/*    ))} */}
      {/*  </Select> */}
      {/* </FormControl> */}
    </>
  );
}
