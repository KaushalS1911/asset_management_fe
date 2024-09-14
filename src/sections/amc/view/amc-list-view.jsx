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
import {LoadingScreen} from "../../../components/loading-screen";
import { ASSETS_API_URL } from '../../../config-global';
import AMCTableFiltersResult from '../amc-table-filters-result';
import AMCTableToolbar from '../amc-table-toolbar';
import AMCTableRow from '../amc-table-row';
import { useGetContract } from '../../../api/amc';
import { isAfter, isBetween } from '../../../utils/format-time';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'srNo', label: '#' },
  { id: 'code', label: 'Name' },
  { id: 'date', label: 'Contact' },
  { id: 'description', label: 'Cost' },
  { id: 'title', label: 'Start Date' },
  { id: 'assigned_to', label: 'End Date' },
  { id: 'description', label: 'Remark' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
  startDate: null,
  endDate: null,
};
const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, {
  value: 'completed',
  label: 'Completed'},{
  value: 'in service',
  label: 'In Service'},{
  value: 'not repairable',
  label: 'Not Repairable'}]

// ----------------------------------------------------------------------

export default function AMCListView() {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { contract, mutate,contractLoading } = useGetContract();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (contract) {
      setTableData(contract);
    }
  }, [contract]);

  const handleDeleteRow = useCallback(
    async (id) => {
      axios
        .delete(`${ASSETS_API_URL}/${user._id}/contract/${id}`)
        .then((res) => {
          if (res) {
            mutate()
            enqueueSnackbar(res?.data?.message);
            router.push(paths.dashboard.amc.list)
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

  const dateError = isAfter(filters.startDate, filters.endDate);
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
      router.push(paths.dashboard.amc.edit(id));
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
      router.push(paths.dashboard.amc.edit(id));
    },
    [router]
  );

  return (
    <>
      {contractLoading ? <LoadingScreen /> :
        <> <Container maxWidth={settings.themeStretch ? false : 'lg'}>
       <CustomBreadcrumbs
         heading="List"
         links={[
           { name: 'Dashboard', href: paths.dashboard.root },
           { name: 'AMC', href: paths.dashboard.amc.root },
         ]}
         action={
           <Button
             component={RouterLink}
             href={paths.dashboard.amc.new}
             variant="contained"
             startIcon={<Iconify icon="mingcute:add-line" />}
           >
             New AMC
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
         {/*            (tab.value === 'in service' && 'warning') ||*/}
         {/*            (tab.value === 'not repairable' && 'error') ||*/}
         {/*            'default'*/}
         {/*          }*/}
         {/*        >*/}
         {/*          {['in service', 'not repairable', 'completed'].includes(tab.value)*/}
         {/*            ? contract?.filter((user) => user.status === tab.value).length*/}
         {/*            : contract?.length}*/}
         {/*        </Label>*/}
         {/*      }*/}
         {/*    />*/}
         {/*  ))}*/}
         {/*</Tabs>*/}
         <AMCTableToolbar filters={filters} onFilters={handleFilters} dateError={dateError} roleOptions={_expenses} />

         {canReset && (
           <AMCTableFiltersResult
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
                     <AMCTableRow
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

function applyFilter({ inputData, comparator, filters ,dateError}) {
  const { name, status, role,startDate, endDate  } = filters;

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
        user.company_name.toLowerCase().indexOf(name.toLowerCase()) !== -1)
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.type));
  }
  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => isBetween(order?.start_date, startDate, endDate));
    }
  }

  return inputData;
}
