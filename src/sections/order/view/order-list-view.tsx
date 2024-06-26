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
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import OrderTableRow from '../order-table-row';
import { useGetOrder } from '../../../api/order';
import OrderTableToolbar from '../order-table-toolbar';
import { IOrder, IOrderTableFilters } from '../../../types/order';
import OrderTableFiltersResult from '../order-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'module', label: 'Модуль' },
  { id: 'phoneNumber', label: 'Номер телефона' },
  { id: 'createdDate', label: 'Дата заявки' },
  { id: 'status', label: 'Статус' },
  { id: 'edit', label: '' },
];

const defaultFilters: IOrderTableFilters = {
  module: '',
  status: '',
};

// ----------------------------------------------------------------------

export default function OrderListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IOrder[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const {
    orderData,
    orderDataLoading,
    pageInfo: { totalPages, currentPage, totalElements },
    mutate,
  } = useGetOrder({
    page: table.page,
    pageSize: table.rowsPerPage,
    module: filters.module,
    status: filters.status,
  });

  useEffect(() => {
    setTableData(orderData || []);
  }, [orderData]);

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !orderData.length && !orderDataLoading;

  const handleFilters = useCallback(
    (name: string, value: string) => {
      table.onResetPage();
      // @ts-ignore
      setFilters((prevState: string) => ({
        // @ts-ignore
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
        <OrderTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <OrderTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={tableData.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row.id.toString())
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
                    tableData.map((row) => row.id.toString())
                  )
                }
              />

              <TableBody>
                {tableData.map((row) => (
                  <OrderTableRow
                    key={row.id}
                    row={row}
                    updateOrder={mutate}
                    selected={table.selected.includes(row.id.toString())}
                    onSelectRow={() => table.onSelectRow(row.id.toString())}
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
