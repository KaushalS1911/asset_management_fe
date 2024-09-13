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
  alpha,
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
  const confirm = useBoolean();
  const { service, mutate,serviceLoading } = useGetService();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (service) {
      setTableData(service);
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
  }, [enqueueSnackbar, mutate, table, confirm]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });


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
         <ServiceTableToolbar filters={filters} onFilters={handleFilters} roleOptions={_expenses} />

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
  const { name, status, role } = filters;

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

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.type));
  }

  return inputData;
}
