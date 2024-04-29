import isEqual from 'lodash/isEqual';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridColDef,
  useGridApiRef,
  GridPaginationMeta,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowSelectionModel,
  GridToolbarQuickFilter,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetCompanies } from 'src/api/company';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IPagination } from 'src/types/pagination';
import { ICompany, ICompanyTableFilters } from 'src/types/company';

import CompaniesTableToolbar from '../companies-table-toolbar';
import CompaniesTableFiltersResult from '../companies-table-filters-result';
import {
  RenderCellPrice,
  RenderCellDecent,
  RenderCellRanges,
  RenderCellPublish,
  RenderCellProduct,
  RenderCellProgress,
  RenderCellCreatedAt,
  RenderCellInvestors,
  RenderCellСompanyType,
} from '../companies-table-row';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Все' },
  { value: 'draft', label: 'Идет сбор займа' },
  { value: 'draft', label: 'Горячее предлжение' },
  { value: 'draft', label: 'Сбор завершен' },
  { value: 'draft', label: 'Займ погашен' },
];

const defaultFilters: ICompanyTableFilters = {
  briefcaseStatus: '',
  companyType: '',
};

const HIDE_COLUMNS = {
  category: false,
};

// ----------------------------------------------------------------------

export default function CompaniesListView() {
  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();

  const confirmRows = useBoolean();

  const router = useRouter();

  const [paginationModel, setPaginationModel] = useState<IPagination>({
    page: 0,
    pageSize: 6,
  });

  const [tableData, setTableData] = useState<ICompany[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const {
    companies,
    companiesLoading,
    pageInfo: { hasNextPage, total },
  } = useGetCompanies({
    ...paginationModel,
    companyType: filters.companyType,
    briefcaseStatus: filters.briefcaseStatus,
  });

  useEffect(() => {
    setTableData(companies || []);
  }, [companies]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback((name: string, value: string) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.briefcaseId));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);
  }, [enqueueSnackbar, selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id: string, companyId: string) => {
      router.push(`${paths.dashboard.companies.edit(id)}?companyId=${companyId}`);
    },
    [router]
  );

  const columns: GridColDef[] = [
    {
      field: 'briefcaseName',
      headerName: 'Название компании',
      flex: 1,
      minWidth: 200,
      hideable: false,
      editable: false,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: 'createdDate',
      headerName: 'Дата создания',
      width: 160,
      editable: false,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'finishDay',
      headerName: 'Дата окончания сбора',
      width: 180,
      editable: false,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'ranges',
      headerName: 'Срок займа',
      width: 150,
      editable: false,
      renderCell: (params) => <RenderCellRanges params={params} />,
    },
    {
      field: 'amountFinish',
      headerName: 'Цель сбора',
      width: 150,
      editable: false,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'pamAmount',
      headerName: 'Собрано',
      width: 150,
      editable: false,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'progress',
      headerName: 'Прогресс',
      width: 160,
      type: 'singleSelect',
      editable: false,
      renderCell: (params) => <RenderCellProgress params={params} />,
    },
    {
      field: 'percents',
      headerName: 'Ставка, % ',
      width: 150,
      editable: false,
      renderCell: (params) => <RenderCellDecent params={params} />,
    },
    {
      field: 'amountMin',
      headerName: 'Минимальная сумма',
      width: 190,
      editable: false,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'pampInvestors',
      headerName: 'Кол-во инвесторов',
      width: 180,
      editable: false,
      renderCell: (params) => <RenderCellInvestors params={params} />,
    },
    {
      field: 'companyType',
      headerName: 'Категория',
      filterable: false,
      editable: false,
      hideable: false,
      width: 172,
      renderCell: (params) => <RenderCellСompanyType params={params} />,
    },
    {
      field: 'briefcaseStatus',
      headerName: 'Статус',
      type: 'singleSelect',
      editable: false,
      width: 150,
      valueOptions: PUBLISH_OPTIONS,
      renderCell: (params) => <RenderCellPublish params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      editable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row.id, params.row.companyInvestId)}
        />,
      ],
    },
  ];

  const apiRef = useGridApiRef();
  const paginationMetaRef = useRef<GridPaginationMeta>({});

  const paginationMeta = useMemo(() => {
    if (hasNextPage !== undefined && paginationMetaRef.current?.hasNextPage !== hasNextPage) {
      paginationMetaRef.current = { hasNextPage };
    }
    return paginationMetaRef.current;
  }, [hasNextPage]);

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : 'xl'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="Компании"
          links={[
            { name: 'Главная', href: paths.dashboard.root },
            {
              name: 'Компании',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.companies.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Создать компанию
            </Button>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        <Card
          sx={{
            height: { xs: 800, md: 2 },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            apiRef={apiRef}
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            rowCount={total}
            columns={columns}
            loading={companiesLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25, 50]}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 },
              },
            }}
            paginationMeta={paginationMeta}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRowIds(newSelectionModel);
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: () => (
                <>
                  <GridToolbarContainer>
                    <CompaniesTableToolbar filters={filters} onFilters={handleFilters} />

                    <Stack
                      spacing={1}
                      flexGrow={1}
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      {!!selectedRowIds.length && (
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                          onClick={confirmRows.onTrue}
                        >
                          Удалить ({selectedRowIds.length})
                        </Button>
                      )}
                    </Stack>
                  </GridToolbarContainer>

                  {canReset && (
                    <CompaniesTableFiltersResult
                      filters={filters}
                      onFilters={handleFilters}
                      onResetFilters={handleResetFilters}
                      results={dataFiltered.length}
                      sx={{ p: 2.5, pt: 0 }}
                    />
                  )}
                </>
              ),
              noRowsOverlay: () => <EmptyContent title="Пусто" />,
              noResultsOverlay: () => <EmptyContent title="Не найдено" />,
            }}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Удалить
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
}: {
  inputData: ICompany[];
  filters: ICompanyTableFilters;
}) {
  return inputData;
}
