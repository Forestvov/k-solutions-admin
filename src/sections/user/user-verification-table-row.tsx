import { NavLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { IUser } from 'src/types/user';

import UserPhotoForm from './user-photo-form';
import UserVerificationQuickEditForm from './user-verification-quick-edit-form';

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

const Link = styled(NavLink)`
  color: #fff;
  text-decoration: none;
`;

export default function UserVerificationTableRow({
  row,
  selected,
  onSelectRow,
  updateTable,
}: Props) {
  const { fio, numberPhone, status, email, accountId, userName, role } = row;

  const quickEdit = useBoolean();
  const openPhotoFirst = useBoolean();
  const openPhotoSecond = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to={`/${accountId}/personal`}>
            <ListItemText
              primary={fio ?? 'не указно'}
              secondary={role === 'Admin' ? 'Администратор' : 'Пользователь'}
              primaryTypographyProps={{ typography: 'body2' }}
            />
          </Link>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{userName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{numberPhone}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textDecoration: 'underline', cursor: 'pointer' }}>
          {row.files[0] && <Box onClick={openPhotoFirst.onTrue}>Ссылка</Box>}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textDecoration: 'underline', cursor: 'pointer' }}>
          {row.files[1] && <Box onClick={openPhotoSecond.onTrue}>Ссылка</Box>}
        </TableCell>

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

      {row.files[0] && (
        <UserPhotoForm
          fileId={row.files[0]}
          open={openPhotoFirst.value}
          onClose={openPhotoFirst.onFalse}
        />
      )}

      {row.files[1] && (
        <UserPhotoForm
          fileId={row.files[1]}
          open={openPhotoSecond.value}
          onClose={openPhotoSecond.onFalse}
        />
      )}

      <UserVerificationQuickEditForm
        currentUser={row}
        open={quickEdit.value}
        updateTable={updateTable}
        onClose={quickEdit.onFalse}
      />
    </>
  );
}
