import React, { useCallback, useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
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
import { LoadingScreen } from '../../components/loading-screen';
import Container from '@mui/material/Container';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import Button from '@mui/material/Button';
import { RouterLink } from '../../routes/components';
import Iconify from '../../components/iconify';
import Card from '@mui/material/Card';
import AssetsTableToolbar from './assets-table-toolbar';
import AssetsTableFiltersResult from './assets-table-filters-result';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import AssetsTableRow from './assets-table-row';
import { isAfter } from '../../utils/format-time';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import moment from 'moment';
import { useGetService } from '../../api/service';
import Label from '../../components/label';
import ServiceTableToolbar from '../service/service-table-toolbar';
import { alpha, Tab, Tabs } from '@mui/material';
import ServiceTableFiltersResult from '../service/service-table-filters-result';
const TABLE_HEAD = [
  { id: 'srNo', label: '#' },
  { id: 'start date', label: 'Start Date' },
  { id: 'end date', label: 'End Date' },
  { id: 'title', label: 'Sended By' },
  { id: 'assigned_to', label: 'Service Person' },
  { id: 'description', label: 'Service Contact' },
  { id: 'received_by', label: 'Received By' },
  { id: 'description', label: 'Remark' },
  { id: 'status', label: 'Status' },
];
const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, {
  value: 'completed',
  label: 'Completed'},{
  value: 'in service',
  label: 'In Service'},{
  value: 'not repairable',
  label: 'Not Repairable'}]
const defaultFilters = {
  publish: [],
  stock: [],
  name:'',
  type:[],
  location:[],
  status: 'all',
};
function AssetServiceInfo({ id }) {
  const table = useTable();
  const router = useRouter();

  const settings = useSettingsContext();

  const { service, serviceLoading,mutate } = useGetService();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);
  const [type,setType] = useState([])
  const [location,setLocation] = useState([])
  useEffect(() => {
    fetchStates();
  }, [tableData]);

  useEffect(() => {
    if (service.length) {
      const fil = service.filter((data) => data?.asset?._id === id)
      setTableData(fil);
    }
  }, [service]);

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
  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);
  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  const dateError = isAfter(filters.startDate, filters.endDate);
  return (
    <>
      {serviceLoading ? <LoadingScreen /> : <Container maxWidth={settings.themeStretch ? false : 'lg'}>
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
                             ? tableData.filter((user) => user.status === tab.value).length
                             : tableData.length}
                         </Label>
                       }
                     />
                   ))}
                 </Tabs>
                 <ServiceTableToolbar
                     filters={filters}
                     onFilters={handleFilters}
                     dateError={dateError}
                 />
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
                      <TableRow hover  >
                        <TableCell >{index + 1}</TableCell>
                        <TableCell >{moment(row.start_date).format("DD/MM/YYYY")}</TableCell>
                        <TableCell >{moment(row.end_date).format("DD/MM/YYYY")}</TableCell>

                        <TableCell >{row?.sended_by}</TableCell>

                        {/*<TableCell>{`${assigned_to?.firstName} ${assigned_to?.lastName}`}</TableCell>*/}
                        <TableCell >{row?.service_person} </TableCell>
                        <TableCell >{row?.service_person_contact} </TableCell>
                        <TableCell >{row?.received_by} </TableCell>
                        <TableCell >{row?.remark} </TableCell>


                        <TableCell>
                          <Label
                            variant="soft"
                            color={
                              (row.status === 'completed' && 'success') ||
                              (row.status === 'in service' && 'warning') ||
                              (row.status === 'not repairable' && 'error') ||
                              'default'
                            }
                          >
                            {row.status}
                          </Label>
                        </TableCell>

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
    </>
  );
}
function applyFilter({ inputData, filters }) {
  const { location, type ,name,status} = filters;
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
  if (type.length) {
    inputData = inputData.filter((user) => type.includes(user?.asset_type));
  }
  if (location.length) {
    inputData = inputData.filter((user) => location.includes(user?.location));
  }

  return inputData;
}

export default AssetServiceInfo;
