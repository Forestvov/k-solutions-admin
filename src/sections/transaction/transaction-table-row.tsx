import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { fDate } from '../../utils/format-time';
import { fNumber } from '../../utils/format-number';
import { ITransaction } from '../../types/transaction';
import TransactionQuickEditForm from './transaction-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  row: ITransaction;
  onSelectRow: VoidFunction;
  updateTable: VoidFunction;
};

const TRANSACTION_STATUS: Record<string, string> = {
  Canceled: 'Отклонена',
  Success: 'Одобренна',
  Process: 'В обработке',
};

export default function TransactionTableRow({ row, selected, onSelectRow, updateTable }: Props) {
  const {
    fio,
    accountTypeName,
    amount,
    transactionStatus,
    email,
    typePay,
    transactionDate,
    username,
    transactionType,
  } = row;

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={fio ?? 'не указно'}
            primaryTypographyProps={{ typography: 'body2' }}
            secondary={accountTypeName === 'Investor' ? 'Инвестор' : 'Компания'}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{username}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {transactionType === 'In' ? 'Пополнение' : 'Вывод'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{typePay}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(transactionDate)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>$ {amount ? fNumber(amount) : '0'}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (transactionStatus === 'Success' && 'success') ||
              (transactionStatus === 'Process' && 'info') ||
              (transactionStatus === 'Canceled' && 'error') ||
              'default'
            }
          >
            {TRANSACTION_STATUS[transactionStatus]}
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

      <TransactionQuickEditForm
        currentTransaction={row}
        open={quickEdit.value}
        updateTable={updateTable}
        onClose={quickEdit.onFalse}
      />
    </>
  );
}
