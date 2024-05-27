import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';

import Iconify from 'src/components/iconify';

import { IUserTableFilters, IUserTableFilterValue } from 'src/types/user';

import { USER_STATUS } from './status-dto';
import { roleOptions } from './role-options';
import { accountType } from './account-type';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IUserTableFilters;
  onFilters: (name: string, value: IUserTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function UserTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}: Props) {
  const handleRemoveRole = useCallback(() => {
    onFilters('role', '');
  }, [onFilters]);

  const handleRemoveStatus = useCallback(() => {
    onFilters('status', '');
  }, [onFilters]);

  const handleRemoveAccountType = useCallback(() => {
    onFilters('accountTypeName', '');
  }, [onFilters]);

  if (!filters.role.length && !filters.status.length && !filters.accountTypeName.length) {
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
        {!!filters.role.length && (
          <Block label="Роль:">
            <Chip
              key={filters.role}
              label={roleOptions.find((item) => item.name === filters.role)?.label}
              size="small"
              onDelete={handleRemoveRole}
            />
          </Block>
        )}

        {!!filters.status.length && (
          <Block label="Статус:">
            <Chip
              key={filters.status}
              label={USER_STATUS[filters.status]}
              size="small"
              onDelete={handleRemoveStatus}
            />
          </Block>
        )}

        {!!filters.accountTypeName.length && (
          <Block label="Тип Аккаунта:">
            <Chip
              key={filters.accountTypeName}
              label={accountType.find((type) => type.name === filters.accountTypeName)?.label}
              size="small"
              onDelete={handleRemoveAccountType}
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
