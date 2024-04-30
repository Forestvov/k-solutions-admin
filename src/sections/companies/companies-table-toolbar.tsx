import { useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { StatusType, CompanyType, ICompanyTableFilters } from 'src/types/company';

import getLabel from './get-label';
import getLabelStatus from './get-label-status';

// ----------------------------------------------------------------------

type Props = {
  filters: ICompanyTableFilters;
  onFilters: (name: string, value: string) => void;
};

const companyOptions: CompanyType[] = ['Franchise', 'Company'];
const statusOptions: StatusType[] = ['In progress', 'Collection completed', 'Loan payed'];

export default function CompaniesTableToolbar({ filters, onFilters }: Props) {
  // const [publish, setPublish] = useState<string>(filters.briefcaseStatus);

  const handleChangeCompany = useCallback(
    (event: SelectChangeEvent<CompanyType>) => {
      onFilters('companyType', event.target.value);
    },
    [onFilters]
  );

  const handleChangeCompanyStatus = useCallback(
    (event: SelectChangeEvent<StatusType>) => {
      onFilters('briefcaseStatus', event.target.value);
    },
    [onFilters]
  );

  // const handleFilterName = useCallback(
  //     (event: React.ChangeEvent<HTMLInputElement>) => {
  //         onFilters('briefcaseName', event.target.value);
  //     },
  //     [onFilters]
  // );

  // const handleChangePublish = useCallback((event: SelectChangeEvent<string>) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setPublish(value);
  // }, []);

  // @ts-ignore
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
          value={filters.companyType}
          onChange={handleChangeCompany}
          input={<OutlinedInput label="Тип" />}
          renderValue={(selected) => getLabel(selected)}
          sx={{ textTransform: 'capitalize' }}
        >
          {companyOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox disableRipple size="small" checked={filters.companyType.includes(option)} />
              {getLabel(option)}
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
          value={filters.briefcaseStatus}
          onChange={handleChangeCompanyStatus}
          input={<OutlinedInput label="Статус" />}
          renderValue={(selected) => getLabelStatus(selected)}
          sx={{ textTransform: 'capitalize' }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                size="small"
                checked={filters.briefcaseStatus.includes(option)}
              />
              {getLabelStatus(option)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
