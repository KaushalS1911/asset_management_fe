import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Container,
  TableBody,
  IconButton,
  TableContainer,
  alpha, CircularProgress, Checkbox, MenuItem, Select, InputLabel, FormControl, OutlinedInput,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { _expenses, USER_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import ServiceTableRow from '../service-table-row';
import ServiceTableToolbar from '../service-table-toolbar';
import ServiceTableFiltersResult from '../service-table-filters-result';
import { useGetService } from '../../../api/service';
import {LoadingScreen} from "../../../components/loading-screen";
import { ASSETS_API_URL } from '../../../config-global';
import GenerateOverviewPdf from '../../generate-pdf/generate-overview-pdf';
import { Box, Stack } from '@mui/system';
import { PDFDownloadLink } from '@react-pdf/renderer';
import * as XLSX from 'xlsx';
import { fDate } from '../../../utils/format-time';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'srNo', label: '#' },
  { id: 'code', label: 'Code' },
  { id: 'date', label: 'Date' },
  { id: 'title', label: 'Sended By' },
  { id: 'assigned_to', label: 'Service Person' },
  { id: 'description', label: 'Contact' },
  { id: 'description', label: 'Remark' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
  type:[],
};
const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, {
  value: 'completed',
  label: 'Completed'},{
  value: 'in service',
  label: 'In Service'},{
  value: 'not repairable',
  label: 'Not Repairable'}]

// ----------------------------------------------------------------------

export default function ServiceListView() {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const [field, setField] = useState([]);
  const confirm = useBoolean();
  const { service, mutate,serviceLoading } = useGetService();
  const [type,setType] = useState([])
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (service) {
      setTableData(service);
      fetchStates()
    }
  }, [service]);

  const handleDeleteRow = useCallback(
    async (id) => {
      axios
        .delete(`${ASSETS_API_URL}/${user._id}/service/${id}`)
        .then((res) => {
          if (res) {
            mutate()
            enqueueSnackbar(res?.data?.message);
            router.push(paths.dashboard.service.list)
          }
        })
        .catch((err) => {
          enqueueSnackbar('Something went wrong',{variant:'error'});
        })
    },
    [enqueueSnackbar, mutate, table, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const selectedIdsArray = [...table.selected];
      const response = await axios.delete(
        `https://admin-panel-dmawv.ondigitalocean.app/api/company/task`,
        { data: { ids: selectedIdsArray } }
      );
      if (response.status === 200) {
        enqueueSnackbar('deleted successfully', { variant: 'success' });
        setTableData((prevData) => prevData.filter((row) => !selectedIdsArray.includes(row.id)));
        table.onUpdatePageDeleteRow(selectedIdsArray.length);
        mutate();
        confirm.onFalse();
      } else {
        enqueueSnackbar('Failed to delete items', { variant: 'error' });
      }
    } catch (error) {
      console.error('Failed to delete Tasks', error);
      enqueueSnackbar('Failed to delete Tasks', { variant: 'error' });
    }
  }, [enqueueSnackbar, mutate, table, confirm,router]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  function fetchStates() {
    service?.map((data) => {
      setType((item) => {
        if (!item.includes(data?.asset?.asset_type)) {
          return [...item, data?.asset?.asset_type];
        } else {
          return item;
        }
      });


    });
  }

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 76;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.service.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.task.edit(id));
    },
    [router]
  );
  const fieldMapping = {
    "Name":"",
    "Type":"",
    'Service By': 'service_by',
    'Sended By': 'sended_by',
    'Service Person': 'service_person',
    'Service Person Contact': 'service_person_contact',
    'Status': 'status',
    'Start Date': 'start_date',
    'End Date': 'end_date',

  };
  const handleExportExcel = () => {
    let data = dataFiltered.map((item) => ({
      'Name' : item?.asset?.asset_name,
      'Type' : item?.asset?.asset_type,
      'Asset Code' : item?.asset?.asset_code,
      'Service By': item?.service_by,
      'Sended By': item?.sended_by,
      'Service Person': item?.service_person,
      'Service Person Contact': item?.service_person_contact,
      'Status': item?.status,
      'Start Date': fDate(item?.start_date),
      'End Date': fDate(item?.end_date),

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
  const assetField = ['Name','Type','Service By', 'Sended By', 'Service Person', 'Service Person Contact', 'Status', 'Start Date', 'End Date'];
  const handleFilterField1 = (event) => {
    const { value } = event.target;
    if (value.length > 7) {
      enqueueSnackbar('You can only select up to 7 options!', { variant: 'error' });
    }else {
    setField(value);
    }
  };

  return (
    <>
      {serviceLoading ? <LoadingScreen /> :
        <> <Container maxWidth={settings.themeStretch ? false : 'lg'}>
       <CustomBreadcrumbs
         heading="List"
         links={[
           { name: 'Dashboard', href: paths.dashboard.root },
           { name: 'Service', href: paths.dashboard.service.root },
         ]}
         action={
           <Button
             component={RouterLink}
             href={paths.dashboard.service.new}
             variant="contained"
             startIcon={<Iconify icon="mingcute:add-line" />}
           >
             New Service
           </Button>
         }
         sx={{
           mb: { xs: 3, md: 5 },
         }}
       />

       <Card>

         <Tabs
           value={filters.status}
           onChange={handleFilterStatus}
           sx={{
             px: 2.5,
             boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
           }}
         >
           {STATUS_OPTIONS.map((tab) => (
             <Tab
               key={tab.value}
               iconPosition='end'
               value={tab.value}
               label={tab.label}
               icon={
                 <Label
                   variant={
                     ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                   }
                   color={
                     (tab.value === 'completed' && 'success') ||
                     (tab.value === 'in service' && 'warning') ||
                     (tab.value === 'not repairable' && 'error') ||
                     'default'
                   }
                 >
                   {['in service', 'not repairable', 'completed'].includes(tab.value)
                     ? service.filter((user) => user.status === tab.value).length
                     : service.length}
                 </Label>
               }
             />
           ))}
         </Tabs>
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
               {assetField.map((option) => (
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
                   <GenerateOverviewPdf
                     allData={dataFiltered}
                     heading={[
                       { hed: 'Asset Name', Size: '180px' },
                       { hed: 'Asset Type', Size: '180px' },
                       { hed: 'Service By', Size: '180px' },
                       {
                         hed: 'Sended By',
                         Size: '120px',
                       },
                       {
                         hed: 'Service Person',
                         Size: '120px',
                       },
                       {
                         hed: 'Service Person Contact',
                         Size: '160px',
                       },
                       {
                         hed: 'Status'
                         , Size: '180px',
                       },
                       {
                         hed: 'Start Date',
                         Size: '170px',
                       },
                       {
                         hed: 'End Date',
                         Size: '120px',
                       },

                     ].filter((item) => (field.includes(item.hed) || !field.length))}
                     orientation={'landscape'}
                     SubHeading={'Services'}
                     fieldMapping={field.length ? extractedData : fieldMapping}
                   />
                 }
                 fileName={'Services'}
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
         <ServiceTableToolbar filters={filters} onFilters={handleFilters} type={type} roleOptions={_expenses} />

         {canReset && (
           <ServiceTableFiltersResult
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
                 dataFiltered.map((row) => row._id)
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
             <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
               <TableHeadCustom
                 order={table.order}
                 orderBy={table.orderBy}
                 headLabel={TABLE_HEAD}
                 rowCount={dataFiltered.length}
                 numSelected={table.selected.length}
                 onSort={table.onSort}
                 // onSelectAllRows={(checked) =>
                 //   table.onSelectAllRows(
                 //     checked,
                 //     dataFiltered.map((row) => row._id)
                 //   )
                 // }
               />

               <TableBody>
                 {dataFiltered
                   .slice(
                     table.page * table.rowsPerPage,
                     table.page * table.rowsPerPage + table.rowsPerPage
                   )
                   .map((row, index) => (
                     <ServiceTableRow
                       mutate={mutate}
                       key={row._id}
                       row={row}
                       index={index}
                       // selected={table.selected.includes(row._id)}
                       // onSelectRow={() => table.onSelectRow(row._id)}
                       onDeleteRow={() => handleDeleteRow(row._id)}
                       onEditRow={() => handleEditRow(row._id)}
                       onViewRow={() => handleViewRow(row._id)}
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
     </Container>

       <ConfirmDialog
         open={confirm.value}
         onClose={confirm.onFalse}
         title="Delete"
         content={
           <>
             Are you sure want to delete <strong> {table.selected.length} </strong> items?
           </>
         }
         action={
           <Button
             variant="contained"
             color="error"
             onClick={() => {
               handleDeleteRows();
               confirm.onFalse();
             }}
           >
             Delete
           </Button>
         }
       />
     </>}
    </>
  );
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role,type } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) =>
        user.sended_by.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.service_person.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  if (type.length) {
    inputData = inputData.filter((user) => type.includes(user?.asset?.asset_type));
  }
  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.type));
  }

  return inputData;
}
