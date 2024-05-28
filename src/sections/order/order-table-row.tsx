// @ts-nocheck
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { fDate } from 'src/utils/format-time';

import { IOrder } from 'src/types/order';

import { nameObj } from './data';
import Label from '../../components/label';
import { orderStatus } from './order-status';
import Iconify from '../../components/iconify';
import { useBoolean } from '../../hooks/use-boolean';
import { OrderQuickEditForm } from './order-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  onSelectRow: VoidFunction;
  selected: boolean;
  row: IOrder;
  updateOrder: VoidFunction;
};

export default function OrderTableRow({ row, selected, onSelectRow, updateOrder }: Props) {
  const { module, phoneNumber, createdDate, status } = row;

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {nameObj[module] ?? 'Не указан (тестовый)'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNumber}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(createdDate)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={
              (status === 'Responded' && 'success') || (status === 'New' && 'warning') || 'default'
            }
          >
            {orderStatus[status]}
          </Label>
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {row.status !== 'Responded' && (
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
      <OrderQuickEditForm
        currentOrder={row}
        open={quickEdit.value}
        updateTable={updateOrder}
        onClose={quickEdit.onFalse}
      />
    </>
  );
}
