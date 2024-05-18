import { NavLink } from 'react-router-dom';

import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { IUser } from 'src/types/user';

import UserQuickEditForm from './user-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  row: IUser;
  onSelectRow: VoidFunction;
  updateTable: VoidFunction;
};

const USER_STATUS: Record<string, string> = {
  Disable: 'Заблокирован',
  Enable: 'Доступен',
  Canceled: 'Отменен',
  Verified: 'Верефицирован',
  Process: 'В обработке',
  'Not verified email': 'Почта не подтверждена',
  'Not verified YC': 'Нет запроса на верификацию',
};

export default function UserTableRow({ row, selected, onSelectRow, updateTable }: Props) {
  const theme = useTheme();

  const {
    fio,
    numberPhone,
    balance,
    status,
    email,
    registeredDate,
    userName,
    role,
    accountId,
    famCeo,
  } = row;

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell
          sx={{
            display: 'flex',
            alignItems: 'center',
            '> a': {
              textDecoration: 'none',
              color: theme.palette.text.primary,
            },
          }}
        >
          <NavLink to={`/admin/user/${accountId}/edit`}>
            <ListItemText
              primary={fio.length > 1 ? fio : famCeo}
              secondary={role === 'Admin' ? 'Администратор' : 'Пользователь'}
              primaryTypographyProps={{ typography: 'body2' }}
            />
          </NavLink>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{userName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{numberPhone}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(registeredDate)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>$ {balance ? fNumber(balance) : '0'}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'Verified' && 'success') ||
              (status === 'Process' && 'warning') ||
              (status === 'Canceled' && 'error') ||
              (status === 'Disable' && 'error') ||
              (status === 'Not verified YC' && 'info') ||
              (status === 'Not verified email' && 'info') ||
              'default'
            }
          >
            {USER_STATUS[status]}
          </Label>
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <UserQuickEditForm
        currentUser={row}
        open={quickEdit.value}
        updateTable={updateTable}
        onClose={quickEdit.onFalse}
      />
    </>
  );
}
