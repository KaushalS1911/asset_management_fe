import React, { useCallback, useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import { useSnackbar } from '../../components/snackbar';
import { useBoolean } from '../../hooks/use-boolean';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom, TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from '../../components/table';
import { useRouter } from '../../routes/hooks';
import { useSettingsContext } from '../../components/settings';
import { useGetAssete } from '../../api/assets';
import isEqual from 'lodash/isEqual';
import axios from 'axios';
import { ASSETS_API_URL } from '../../config-global';
import { paths } from '../../routes/paths';
import { isAfter } from '../../utils/format-time';
import { LoadingScreen } from '../../components/loading-screen';
import Container from '@mui/material/Container';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Button from '@mui/material/Button';
import { RouterLink } from '../../routes/components';
import Iconify from '../../components/iconify';
import Card from '@mui/material/Card';
import AssetsTableToolbar from '../assets/assets-table-toolbar';
import AssetsTableFiltersResult from '../assets/assets-table-filters-result';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { ConfirmDialog } from '../../components/custom-dialog';
import moment from 'moment';

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
];
function AmcModel({open, onClose,setOpen,setAssetsCode,codes,singleService}) {
  const { enqueueSnackbar } = useSnackbar();

  const confirm = useBoolean();
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
    setAssetsCode(id)
    setOpen(false)

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
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  useEffect(() => {
    if(singleService && singleService.assets){
      singleService.assets.map((item) => table.onSelectRow(item))
    }
  },[singleService])
  return (
    <>
      <Dialog
        fullWidth
        maxWidth={settings.themeStretch ? false : 'lg'}
        open={open}
        onClose={() => setOpen(false)}

      >
          <DialogTitle>Assets</DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ p: 3 }}>
              {assetsLoading ? <LoadingScreen /> : <Container maxWidth={settings.themeStretch ? false : 'lg'}>

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
                        <Tooltip title='Save'>
                          <Button variant={"contained"} color={'primary'} onClick={confirm.onTrue}>Save</Button>
                          {/*<IconButton color='primary' onClick={confirm.onTrue}>*/}
                          {/*  <Iconify icon='solar:trash-bin-trash-bold' />*/}
                          {/*</IconButton>*/}
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
                          onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                              checked,
                              dataFiltered.map((row) => row._id),
                            )
                          }
                        />
                        <TableBody>
                          {dataFiltered
                            .slice(
                              table.page * table.rowsPerPage,
                              table.page * table.rowsPerPage + table.rowsPerPage,
                            )
                            .map((row,index) => (
                              // <AssetsTableRow
                              //   key={row._id}
                              //   row={row}
                              //   index={index}
                              //   selected={table.selected.includes(row._id)}
                              //   onSelectRow={() => table.onSelectRow(row._id)}
                              //   onDeleteRow={() => handleDeleteRows(row._id)}
                              //   onView={() => handleViewRow(row._id)}
                              //   onEditRow={() => handleEditRow(row._id)}
                              // />
                              <TableRow hover selected={table.selected.includes(row._id)}>
                                <TableCell padding="checkbox">
                                  <Checkbox checked={table.selected.includes(row._id)} onClick={() => table.onSelectRow(row._id)} />
                                </TableCell>

                                <TableCell>{index+1}</TableCell>
                                <TableCell sx={{ display: 'flex', alignItems: 'center',cursor:"pointer" }} >
                                  <Avatar alt={`${row?.asset_name}`} src={row?.image_url} sx={{ mr: 2 }} />
                                  {/*<TableCell sx={{ whiteSpace: 'nowrap' }}>{person_name}</TableCell>*/}
                                  <ListItemText
                                    primary={`${row?.asset_name}`}
                                    secondary={""}
                                    primaryTypographyProps={{ typography: 'body2',fontWeight:600 }}
                                    secondaryTypographyProps={{
                                      component: 'span',
                                      color: 'text.disabled',
                                    }}
                                  />
                                </TableCell>

                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.person_name}</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.asset_code}</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.asset_type}</TableCell>

                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.location}</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.seller_name}</TableCell>

                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                  {moment(row?.purchase_date).format('DD/MM/YYYY')}
                                </TableCell>

                                {/*<TableCell>*/}
                                {/*  <Label*/}
                                {/*    variant="soft"*/}
                                {/*    color={*/}
                                {/*      (row.status === 'completed' && 'success') ||*/}
                                {/*      (row.status === 'running' && 'warning') ||*/}
                                {/*      (row.status === 'leaved' && 'error') ||*/}
                                {/*      (row.status === 'training' && 'info') ||*/}
                                {/*      'default'*/}
                                {/*    }*/}
                                {/*  >*/}
                                {/*    {row.status}*/}
                                {/*  </Label>*/}
                                {/*</TableCell>*/}


                              </TableRow>
                            ))}
                          <TableEmptyRows
                            height={denseHeight}
                            emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                          />
                          <TableNoData notFound={notFound} />
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
                title='Assets'
                content={
                  <>
                    Are you sure want to select <strong> {table.selected.length} </strong> assets?
                  </>
                }
                action={
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      handleDeleteRows(table.selected);
                      confirm.onFalse();
                    }}
                  >
                    Save
                  </Button>
                }
              />

            </Stack>
          </DialogContent>

      </Dialog>
    </>
  );
};
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
export default AmcModel;
