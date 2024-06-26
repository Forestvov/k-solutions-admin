import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';

import Iconify from 'src/components/iconify';

import getLabel from './get-label';
import getLabelStatus from './get-label-status';
import { ICompanyTableFilters } from '../../types/company';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: ICompanyTableFilters;
  onFilters: (name: string, value: string) => void;
  onResetFilters: VoidFunction;
  results: number;
};

export default function CompaniesTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}: Props) {
  const handleRemoveCompanyType = useCallback(() => {
    onFilters('companyType', '');
  }, [onFilters]);

  const handleRemoveCompanyStatus = useCallback(() => {
    onFilters('briefcaseStatus', '');
  }, [onFilters]);

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          результатов найдено
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.companyType.length && (
          <Block label="Категория:">
            <Chip
              key={filters.companyType}
              label={getLabel(filters.companyType)}
              size="small"
              onDelete={handleRemoveCompanyType}
            />
          </Block>
        )}

        {!!filters.briefcaseStatus.length && (
          <Block label="Статус:">
            <Chip
              key={filters.briefcaseStatus}
              label={getLabelStatus(filters.briefcaseStatus)}
              size="small"
              onDelete={handleRemoveCompanyStatus}
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
