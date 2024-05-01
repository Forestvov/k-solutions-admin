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

import { ITransaction, ITransactionTableFilters } from 'src/types/transaction';

import TransactionTableRow from '../transaction-table-row';
import { useGetTransactionList } from '../../../api/transaction';
import TransactionTableToolbar from '../transaction-table-toolbar';
import TransactionTableFiltersResult from '../transaction-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fio', label: 'Фио', width: 180 },
  { id: 'username', label: 'Логин', width: 180 },
  { id: 'mail', label: 'Mail', width: 190 },
  { id: 'numberPhone', label: 'Тип транзакции', width: 220 },
  { id: 'transactionLinkType', label: 'Платежная система', width: 180 },
  { id: 'date', label: 'Дата транзакции', width: 180 },
  { id: 'balance', label: 'Сумма', width: 100 },
  { id: 'transactionStatus', label: 'Статус', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters: ITransactionTableFilters = {
  transactionStatus: '',
  transactionType: '',
  transactionLinkType: '',
  email: '',
};

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
  } = useGetTransactionList({
    page: table.page,
    pageSize: table.rowsPerPage,
    transactionStatus: filters.transactionStatus,
    transactionType: filters.transactionType,
    transactionLinkType: filters.transactionLinkType,
  });

  const updateTable = () => {
    mutate();
  };

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
      setFilters((prevState: ITransactionTableFilters) => ({
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
                headLabel={TABLE_HEAD}
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
                    key={row.accountId}
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
  filters: ITransactionTableFilters;
}) {
  const { email = '' } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (email) {
    inputData = inputData.filter(
      // @ts-ignore
      (transaction) => transaction.email.toLowerCase().indexOf(email.toLowerCase()) !== -1
    );
  }

  return inputData;
}
