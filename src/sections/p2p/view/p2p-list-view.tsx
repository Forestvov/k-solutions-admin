import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { ITransaction, IP2PTableFilters } from 'src/types/transaction';

import P2PTableTabs from '../p2p-table-tabs';
import TransactionTableRow from '../p2p-table-row';
import TransactionTableToolbar from '../p2p-table-toolbar';
import { useGetTransactionP2pList } from '../../../api/transaction';
import TransactionTableFiltersResult from '../p2p-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'Wait requisites', label: 'Ожидание реквизитов' },
  { value: 'Process', label: 'В процессе оплаты' },
  { value: 'Marked as paid', label: 'Отмеченно как оплаченно' },
  { value: 'Canceled', label: 'Отклоненные' },
  { value: 'Success', label: 'Выполненные' },
];

const defaultFilters: IP2PTableFilters = {
  transactionStatus: '',
  transactionType: 'In',
};

const TABLE_HEAD_IN = [
  { id: 'fio', label: 'Фио', width: 180 },
  { id: 'username', label: 'Логин', width: 140 },
  { id: 'email', label: 'Mail', width: 190 },
  { id: 'transactionDate', label: 'Дата заявки оредра', width: 180 },
  { id: 'currentName', label: 'Банк', width: 150 },
  { id: 'amount', label: 'Сумма отправки ₽', width: 180 },
  { id: 'amountIn', label: 'Сумма получения USDT', width: 180 },
  { id: 'balance', label: 'Время для выдачи реквизитов', width: 80 },
  { id: 'status1', label: 'Время для оплаты', width: 100 },
  { id: 'status', label: 'Статус', width: 100 },
  { id: '', width: 88 },
];

const TABLE_HEAD_OUT = [
  { id: 'fio', label: 'Фио', width: 180 },
  { id: 'username', label: 'Логин', width: 140 },
  { id: 'email', label: 'Mail', width: 190 },
  { id: 'transactionDate', label: 'Дата заявки оредра', width: 180 },
  { id: 'currentName', label: 'Банк', width: 150 },
  { id: 'amount', label: 'Сумма вывода ₽', width: 180 },
  { id: 'status', label: 'Статус', width: 100 },
  { id: '', width: 88 },
];
// ----------------------------------------------------------------------

export default function TransactionListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<ITransaction[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const {
    transactions,
    pageInfo: { totalPages, currentPage, totalElements },
    mutate,
  } = useGetTransactionP2pList({
    page: table.page,
    pageSize: table.rowsPerPage,
    transactionStatus: filters.transactionStatus,
    transactionType: filters.transactionType,
  });

  const updateTable = useCallback(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    const interval = setInterval(updateTable, 10000);

    return () => clearInterval(interval);
  }, [updateTable]);

  useEffect(() => {
    setTableData(transactions || []);
  }, [transactions]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: string) => {
      table.onResetPage();
      setFilters((prevState: IP2PTableFilters) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Cписок"
        links={[{ name: 'Главная', href: paths.dashboard.root }, { name: 'Список' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <P2PTableTabs options={STATUS_OPTIONS} onFilters={handleFilters} filters={filters} />

        <TransactionTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <TransactionTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.accountId.toString())
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1330 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={filters.transactionType === 'In' ? TABLE_HEAD_IN : TABLE_HEAD_OUT}
                rowCount={totalPages}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.accountId.toString())
                  )
                }
              />

              <TableBody>
                {dataFiltered.map((row) => (
                  <TransactionTableRow
                    type={filters.transactionType}
                    key={row.transactionId}
                    row={row}
                    selected={table.selected.includes(row.accountId.toString())}
                    onSelectRow={() => table.onSelectRow(row.accountId.toString())}
                    updateTable={updateTable}
                  />
                ))}
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={totalElements}
          page={currentPage}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: ITransaction[];
  comparator: (a: any, b: any) => number;
  filters: IP2PTableFilters;
}) {
  // const { email = '' } = filters;
  //
  // const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  //
  // stabilizedThis.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });
  //
  // inputData = stabilizedThis.map((el) => el[0]);
  //
  // if (email) {
  //   inputData = inputData.filter(
  //     // @ts-ignore
  //     (transaction) => transaction.email.toLowerCase().indexOf(email.toLowerCase()) !== -1
  //   );
  // }

  return inputData;
}
