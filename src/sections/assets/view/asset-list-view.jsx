import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';


import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AssetsTableFiltersResult from '../assets-table-filters-result';
import AssetsTableToolbar from '../assets-table-toolbar';
import { useGetAssete } from '../../../api/assets';
import AssetsTableRow  from '../assets-table-row';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { LoadingScreen } from '../../../components/loading-screen';

import TableContainer from '@mui/material/TableContainer';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData, TablePaginationCustom,
  TableSelectedAction, useTable,
} from '../../../components/table';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Scrollbar from '../../../components/scrollbar/scrollbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { isAfter } from '../../../utils/format-time';
import axios from 'axios';
// import {
//   RenderCellStock,
//   RenderCellPrice,
//   RenderCellPublish,
//   RenderCellProduct,
//   RenderCellCreatedAt,
// } from '../product-table-row';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const defaultFilters = {
  publish: [],
  stock: [],
  name:'',
  type:[],
  location:[],
};

const HIDE_COLUMNS = {
  category: false,
};
const TABLE_HEAD = [
  { id: 'enrollment_no', label: '#' },
  { id: 'name', label: 'Asset' },
  { id: 'person_name', label: 'Assign to' },
  { id: 'contact', label: 'Code' },
  { id: 'course', label: 'Type' },
  { id: 'joining_date', label: 'Location' },
  { id: 'status', label: 'Seller name' },
  { id: 'status', label: 'Purchase Date' },
  { id: '' },
];
const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function AssetsListView() {
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();
  const table = useTable();
  const router = useRouter();

  const settings = useSettingsContext();

  const { assets, assetsLoading,mutate } = useGetAssete();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [type,setType] = useState([])
  const [location,setLocation] = useState([])

  useEffect(() => {
    fetchStates();
  }, [tableData]);
  useEffect(() => {
    if (assets.length) {
      setTableData(assets);
    }
  }, [assets]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters,
  });
  function fetchStates() {
    dataFiltered?.map((data) => {
      setType((item) => {
        if (!item.includes(data.asset_type)) {
          return [...item, data.asset_type];
        } else {
          return item;
        }
      });
      setLocation((item) => {
        if (!item.includes(data?.location)) {
          return [...item, data?.location];
        } else {
          return item;
        }
      });

    });
  }

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);



  const handleDeleteRows = useCallback((id) => {
    // const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));
    axios
      .delete(`https://asset-management-be-dkf8.onrender.com/asset/${id}`)
      .then((res) => {
        if (res) {
          mutate()
          enqueueSnackbar(res?.data?.message);
          router.push(paths.dashboard.assets.list)
        }
      })
      .catch((err) => {
        enqueueSnackbar('Something went wrong',{variant:'error'});
      });

    // setTableData(deleteRows);
  }, [enqueueSnackbar, selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.assets.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.assets.view(id));
    },
    [router]
  );
  const dateError = isAfter(filters.startDate, filters.endDate);

  return (
    <>
      {assetsLoading ? <LoadingScreen /> : <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='List'
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Asset List', href: paths.dashboard.assets.list },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.assets.new}
              variant='contained'
              startIcon={<Iconify icon='mingcute:add-line' />}
            >
              New Asset
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          {/*<Tabs*/}
          {/*  value={filters.status}*/}
          {/*  onChange={handleFilterStatus}*/}
          {/*  sx={{*/}
          {/*    px: 2.5,*/}
          {/*    boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  {STATUS_OPTIONS.map((tab) => (*/}
          {/*    <Tab*/}
          {/*      key={tab.value}*/}
          {/*      iconPosition='end'*/}
          {/*      value={tab.value}*/}
          {/*      label={tab.label}*/}
          {/*      icon={*/}
          {/*        <Label*/}
          {/*          variant={*/}
          {/*            ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'*/}
          {/*          }*/}
          {/*          color={*/}
          {/*            (tab.value === 'completed' && 'success') ||*/}
          {/*            (tab.value === 'running' && 'warning') ||*/}
          {/*            (tab.value === 'leaved' && 'error') ||*/}
          {/*            (tab.value === 'training' && 'info') ||*/}
          {/*            'default'*/}
          {/*          }*/}
          {/*        >*/}
          {/*          {['running', 'leaved', 'completed', 'training'].includes(tab.value)*/}
          {/*            ? students.filter((user) => user.status === tab.value).length*/}
          {/*            : students.length}*/}
          {/*        </Label>*/}
          {/*      }*/}
          {/*    />*/}
          {/*  ))}*/}
          {/*</Tabs>*/}
          <AssetsTableToolbar
            filters={filters}
            onFilters={handleFilters}
            dateError={dateError}
            type={type}
            location={location}
          />
          {canReset && (
            <AssetsTableFiltersResult
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
                  dataFiltered.map((row) => row._id),
                )
              }
              action={
                <Tooltip title='Delete'>
                  <IconButton color='primary' onClick={confirm.onTrue}>
                    <Iconify icon='solar:trash-bin-trash-bold' />
                  </IconButton>
                </Tooltip>
              }
            />
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}

                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map((row,index) => (
                      <AssetsTableRow
                        key={row._id}
                        row={row}
                        index={index}
                        selected={table.selected.includes(row._id)}
                        // onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRows(row._id)}
                        onView={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />
                  {/*<TableNoData notFound={notFound} />*/}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete Student'
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> student?
          </>
        }
        action={
          <Button
            variant='contained'
            color='error'
            onClick={() => {
              handleDeleteRows(table.selected);
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters }) {
  const { location, type ,name} = filters;
  if (name) {
    inputData = inputData.filter(
      (user) =>
        user.asset_name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.person_name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  if (type.length) {
    inputData = inputData.filter((user) => type.includes(user?.asset_type));
  }
  if (location.length) {
    inputData = inputData.filter((user) => location.includes(user?.location));
  }

  return inputData;
}
