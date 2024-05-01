import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { IBrief } from 'src/types/brief';

import CloseQuickEditForm from './close-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  row: IBrief;
  onSelectRow: VoidFunction;
  updateTable: VoidFunction;
};

const STATUS: Record<string, string> = {
  Process: 'В обработке',
  Approved: 'Одобренна',
  Canceled: 'Отклонена',
};

export default function CloseTableRow({ row, selected, onSelectRow, updateTable }: Props) {
  const {
    accountFio,
    amount,
    createddate,
    briefcaseName,
    briefcaseAccountOrderToCloseStatus,
    accountUsername,
    email,
  } = row;

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center', height: '69px' }}>
          <ListItemText
            primary={accountFio ?? 'не указно'}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{accountUsername}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(createddate)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{briefcaseName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>$ {amount ? fNumber(amount) : '0'}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (briefcaseAccountOrderToCloseStatus === 'Approved' && 'success') ||
              (briefcaseAccountOrderToCloseStatus === 'Process' && 'warning') ||
              (briefcaseAccountOrderToCloseStatus === 'Canceled' && 'error') ||
              'default'
            }
          >
            {STATUS[briefcaseAccountOrderToCloseStatus]}
          </Label>
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {briefcaseAccountOrderToCloseStatus !== 'Approved' && (
            <Tooltip title="Quick Edit" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={quickEdit.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>

      <CloseQuickEditForm
        current={row}
        open={quickEdit.value}
        updateTable={updateTable}
        onClose={quickEdit.onFalse}
      />
    </>
  );
}
