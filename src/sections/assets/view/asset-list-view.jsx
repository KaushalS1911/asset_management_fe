import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
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
import { fDate, isAfter } from '../../../utils/format-time';
import axios from 'axios';
import { ASSETS_API_URL } from '../../../config-global';
import { useAuthContext } from '../../../auth/hooks';
import { Checkbox, CircularProgress, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import GenerateOverviewPDF from '../../generate-pdf/generate-overview-pdf';
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
  const {user} = useAuthContext()
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();
  const table = useTable();
  const router = useRouter();

  const settings = useSettingsContext();

    const { assets,assetsLoading,mutate } = useGetAssete();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);
  const [field, setField] = useState([]);
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
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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
      .delete(`${ASSETS_API_URL}/${user._id}/asset/${id}`)
      .then((res) => {
        if (res.data.message) {
          mutate()
          enqueueSnackbar(res?.data?.message);
          router.push(paths.dashboard.assets.list)
          setTableData(assets);
        }
      })
      .catch((err) => {
        enqueueSnackbar('Something went wrong',{variant:'error'});
      });

    // setTableData(deleteRows);
  }, [enqueueSnackbar,assets,mutate,router]);

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

  const fieldMapping = {
    'Name': 'asset_name',
    'Type': 'asset_type',
    'Company': 'company',
    'Location': 'location',
    'Seller name': 'seller_name',
    'Seller Contact': 'seller_contact',
    'Seller Company': 'seller_company',
    'Warranty start': 'warranty_start_date',
    'Warranty end': 'warranty_end_date',
    'Remark': 'remark',

  };
  const handleExportExcel = () => {
    let data = dataFiltered.map((item) => ({
      'Name': item?.asset_name,
      'Type': item?.asset_type,
      'Company': item?.company,
      'Location': item?.location,
      'Seller name': item?.seller_name,
      'Seller Contact': item?.seller_contact,
      'Seller Company': item?.seller_company,
      'Warranty start':fDate(item?.warranty_start_date) ,
      'Warranty end':fDate(item?.warranty_end_date),
      'Remark': item?.remark,
    }));
    if (field.length) {
      data = data.map((item) => {
        const filteredItem = {};
        field.forEach((key) => {
          if (item.hasOwnProperty(key)) {
            filteredItem[key] = item[key];
          }
        });
        return filteredItem;
      });
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets');
    XLSX.writeFile(workbook, 'AssetList.xlsx');
    setField([]);
  };

  const extractedData = field.reduce((result, key) => ({
    ...result,
    [key]: fieldMapping[key],
  }), {});
  const assetField = ['Name', 'Type', 'Company', 'Location', 'Seller name', 'Seller Contact', 'Seller Company', 'Warranty start', 'Warranty end', 'Remark', 'Course'];
  const handleFilterField1 = (event) => {
    const { value } = event?.target;
    if (value?.length > 7) {
      enqueueSnackbar('You can only select up to 7 options!', { variant: 'error' });
    }else {
    setField(value);
    }
  };

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
          {/*<Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 1 }}>*/}
          {/*<FormControl*/}
          {/*  sx={{*/}
          {/*    flexShrink: 0,*/}
          {/*    width: { xs: '100%', md: 200 },*/}
          {/*    margin: '0px 10px',*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <InputLabel>Field</InputLabel>*/}
          {/*  <Select*/}
          {/*    multiple*/}
          {/*    value={field}*/}
          {/*    onChange={handleFilterField1}*/}
          {/*    input={<OutlinedInput label='Field' />}*/}
          {/*    renderValue={(selected) => selected.join(', ')}*/}
          {/*    MenuProps={{*/}
          {/*      PaperProps: {*/}
          {/*        sx: { maxHeight: 240 },*/}
          {/*      },*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    {assetField.map((option) => (*/}
          {/*      <MenuItem key={option} value={option}>*/}
          {/*        <Checkbox*/}
          {/*          disableRipple*/}
          {/*          size='small'*/}
          {/*          checked={field?.includes(option)}*/}
          {/*        />*/}
          {/*        {option}*/}
          {/*      </MenuItem>*/}
          {/*    ))}*/}
          {/*  </Select>*/}
          {/*</FormControl>*/}
          {/*  </Box>*/}
          <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} width={'100%'} mt={3}>
            <FormControl
              sx={{
                flexShrink: 0,
                width: {xs: 200 },
                margin: '0px 10px',
              }}
            >
              <InputLabel>Field</InputLabel>
              <Select
                multiple
                value={field}
                onChange={handleFilterField1}
                input={<OutlinedInput label='Field' />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 240 },
                  },
                }}
              >
                {assetField?.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox
                      disableRipple
                      size='small'
                      checked={field?.includes(option)}
                    />
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
              <Stack direction='row'
                     spacing={1} flexGrow={1}
                     mx={1}>
                <PDFDownloadLink
                  document={
                    <GenerateOverviewPDF
                      allData={dataFiltered}
                      heading={[
                        { hed: 'Name', Size: '180px' },
                        {
                          hed: 'Type',
                          Size: '120px',
                        },
                        {
                          hed: 'Company',
                          Size: '120px',
                        },
                        {
                          hed: 'Location',
                          Size: '160px',
                        },
                        {
                          hed: 'Seller name'
                          , Size: '180px',
                        },
                        {
                          hed: 'Seller Contact',
                          Size: '170px',
                        },
                        {
                          hed: 'Seller Company',
                          Size: '180px',
                        },
                        {
                          hed: 'Warranty start',
                          Size: '120px',
                        },
                        {
                          hed: 'Warranty end',
                          Size: '180px',
                        },
                        {
                          hed: 'Remark',
                          Size: '200px',
                        },

                        ].filter((item) => (field.includes(item.hed) || !field.length))}
                      orientation={'landscape'}
                      SubHeading={'Assets'}
                      fieldMapping={field.length ? extractedData : fieldMapping}
                    />
                  }
                  fileName={'Assets'}
                  style={{ textDecoration: 'none' }}
                >
                  {({ loading }) => (
                    <Tooltip title='Export to PDF'>
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Iconify
                          icon='eva:cloud-download-fill'
                          onClick={() => setField([])}
                          sx={{ width: 24, height: 30, color: '#637381', mt: 1 }}
                        />
                      )}

                    </Tooltip>
                  )}
                </PDFDownloadLink>
              </Stack>
              <Tooltip title='Export to Excel'>
                <Iconify icon='icon-park-outline:excel' width={22} height={24} color={'#637381'} onClick={handleExportExcel} sx={{cursor: "pointer",mr:2}}/>
              </Tooltip>
            </Box>
          </Box>
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
      {/*<ConfirmDialog*/}
      {/*  open={confirm.value}*/}
      {/*  onClose={confirm.onFalse}*/}
      {/*  title='Delete Student'*/}
      {/*  content={*/}
      {/*    <>*/}
      {/*      Are you sure want to delete <strong> {table.selected.length} </strong> student?*/}
      {/*    </>*/}
      {/*  }*/}
      {/*  action={*/}
      {/*    <Button*/}
      {/*      variant='contained'*/}
      {/*      color='error'*/}
      {/*      onClick={() => {*/}
      {/*        handleDeleteRows(table.selected);*/}
      {/*        confirm.onFalse();*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      Delete*/}
      {/*    </Button>*/}
      {/*  }*/}
      {/*/>*/}
    </>
  );
};

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
