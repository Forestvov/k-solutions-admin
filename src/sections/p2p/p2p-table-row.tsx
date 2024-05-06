import { useEffect, useContext } from 'react';

import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

import Label from 'src/components/label';

import { ITransaction } from 'src/types/transaction';

import CountdownTimer from './p2p-timer';
import { paths } from '../../routes/paths';
import { useRouter } from '../../routes/hooks';
import Iconify from '../../components/iconify';
import { TimerContext } from '../../timer/context';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  row: ITransaction;
  onSelectRow: VoidFunction;
  updateTable: VoidFunction;
};

const USER_STATUS: Record<string, string> = {
  'Wait requisites': 'Ожидание реквизитов',
  Canceled: 'Отклоненно',
  Success: 'Выполненно',
  Process: 'В процессе оплаты',
  'Marked as paid': 'Отмеченно как оплаченно',
};

export default function P2pTableRow({ row, selected, onSelectRow, updateTable }: Props) {
  const {
    fio,
    transactionDate,
    currentName,
    username,
    amount,
    amountIn,
    email,
    transactionStatus,
    transactionId,
  } = row;

  const router = useRouter();

  const { wait_requisites, wait_process } = useContext(TimerContext);

  useEffect(() => {
    if (transactionStatus === 'Wait requisites' && wait_requisites) {
      const elMinutes1 = document.querySelector(`.minutes-requisites-${transactionId}`);
      const elSeconds1 = document.querySelector(`.seconds-requisites-${transactionId}`);

      if (!elMinutes1 || !elSeconds1) {
        return;
      }

      const deadline1 = new Date(transactionDate);
      deadline1.setMinutes(deadline1.getMinutes() + wait_requisites);

      // eslint-disable-next-line no-new
      new CountdownTimer(
        deadline1,
        (timer: {
          minutes: string | null;
          seconds: string | null;
          minutesTitle: any;
          secondsTitle: any;
        }) => {
          elMinutes1.textContent = timer.minutes;
          elSeconds1.textContent = timer.seconds;
          // eslint-disable-next-line eqeqeq
          // @ts-ignore
          elMinutes1.dataset.title = timer.minutesTitle;
          // @ts-ignore
          elSeconds1.dataset.title = timer.secondsTitle;
        },
        () => {}
      );
    }

    if (transactionStatus === 'Process' && wait_process) {
      const elMinutes1 = document.querySelector(`.minutes-process-${transactionId}`);
      const elSeconds1 = document.querySelector(`.seconds-process-${transactionId}`);

      if (!elMinutes1 || !elSeconds1) {
        return;
      }

      const deadline1 = new Date(transactionDate);
      deadline1.setMinutes(deadline1.getMinutes() + wait_process);

      // eslint-disable-next-line no-new
      new CountdownTimer(
        deadline1,
        (timer: {
          minutes: string | null;
          seconds: string | null;
          minutesTitle: any;
          secondsTitle: any;
        }) => {
          elMinutes1.textContent = timer.minutes;
          elSeconds1.textContent = timer.seconds;
          // eslint-disable-next-line eqeqeq
          // @ts-ignore
          elMinutes1.dataset.title = timer.minutesTitle;
          // @ts-ignore
          elSeconds1.dataset.title = timer.secondsTitle;
        },
        () => {}
      );
    }
  }, [transactionDate, transactionId, transactionStatus, wait_process, wait_requisites]);

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={fio ?? 'не указно'}
          primaryTypographyProps={{ typography: 'body2' }}
        />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{username}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(new Date(transactionDate))}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentName}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{amountIn ? fNumber(amountIn) : '0'} ₽</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>$ {amount ? fNumber(amount) : '0'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {transactionStatus === 'Wait requisites' ? (
          <div>
            <span className={`minutes-requisites-${transactionId}`} />
            :
            <span className={`seconds-requisites-${transactionId}`} />
          </div>
        ) : null}
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {transactionStatus === 'Process' ? (
          <div>
            <span className={`minutes-process-${transactionId}`} />
            :
            <span className={`seconds-process-${transactionId}`} />
          </div>
        ) : null}
      </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (transactionStatus === 'Success' && 'success') ||
            (transactionStatus === 'Process' && 'warning') ||
            (transactionStatus === 'Canceled' && 'error') ||
            (transactionStatus === 'Marked as paid' && 'info') ||
            (transactionStatus === 'Wait requisites' && 'secondary') ||
            'primary'
          }
        >
          {USER_STATUS[transactionStatus]}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip
          title="Quick Edit"
          placement="top"
          arrow
          onClick={() => {
            router.push(paths.dashboard.p2p.edit(String(transactionId)));
          }}
        >
          <IconButton color="inherit">
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
