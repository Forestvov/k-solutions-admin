import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { IUser } from 'src/types/user';

import { fDate } from '../../utils/format-time';
import { fNumber } from '../../utils/format-number';
import P2pQuickEditForm from './p2p-quick-edit-form';
import {ITransaction} from "../../types/transaction";

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  row: ITransaction;
  onSelectRow: VoidFunction;
  updateTable: VoidFunction;
};

const USER_STATUS: Record<string, string> = {
  Canceled: 'Отклонена',
  Success: 'Одобренна',
  Process: 'В обработке',
};

export default function P2pTableRow({ row, selected, onSelectRow, updateTable }: Props) {
  const { fio, transactionDate, username, amount, amountIn, status, email, registeredDate, userName , transactionStatus} = row;

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
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{username}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(transactionDate)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(registeredDate)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>$ {amount ? fNumber(amount) : '0'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>$ {amountIn ? fNumber(amountIn) : '0'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>1</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>1</TableCell>

        <TableCell>
          <Label
              variant="soft"
              color={
                  (transactionStatus === 'Success' && 'success') ||
                  (transactionStatus === 'Process' && 'warning') ||
                  (transactionStatus === 'Canceled' && 'error') ||
                  'default'
              }
          >
            {USER_STATUS[transactionStatus]}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}/>
      </TableRow>
    </>
  );
}
