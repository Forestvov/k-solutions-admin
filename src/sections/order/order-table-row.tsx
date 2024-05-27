// @ts-nocheck
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { nameObj } from './data';
import { IOrder } from '../../types/order';

// ----------------------------------------------------------------------

type Props = {
  onSelectRow: VoidFunction;
  selected: boolean;
  row: IOrder;
};

export default function OrderTableRow({ row, selected, onSelectRow }: Props) {
  const { module, phoneNumber } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{nameObj[module]}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNumber}</TableCell>
    </TableRow>
  );
}
