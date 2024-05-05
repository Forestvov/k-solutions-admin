import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';

import Iconify from 'src/components/iconify';

import { ICloseTableFilters, ICloseTableFilterValue } from 'src/types/brief';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: ICloseTableFilters;
  onFilters: (name: string, value: ICloseTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

const STATUS: Record<string, string> = {
  'Order to close': 'В обработке',
  'Approved to extract': 'Одобренна',
  'Canceled to extract': 'Отклонена'
};

export default function CloseTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}: Props) {
  const handleRemoveRole = useCallback(() => {
    onFilters('briefcaseAccountStatus', '');
  }, [onFilters]);

  if (!filters.briefcaseAccountStatus.length) {
    return null;
  }

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          найдено:
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.briefcaseAccountStatus.length && (
          <Block label="Статус:">
            <Chip
              key={filters.briefcaseAccountStatus}
              label={STATUS[filters.briefcaseAccountStatus]}
              size="small"
              onDelete={handleRemoveRole}
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
