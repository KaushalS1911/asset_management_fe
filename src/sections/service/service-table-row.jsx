import PropTypes from 'prop-types';
import moment from 'moment';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// import TaskQuickEditForm from './task-quick-edit-form';
import Label from 'src/components/label';
import { Tooltip } from '@mui/material';
import ServiceQuickEditForm from './service-quick-edit-form';

// ----------------------------------------------------------------------

export default function ServiceTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  index,
  mutate
}) {
  const { asset,sended_by, start_date ,remark,service_person,service_person_contact} = row;
  const confirm = useBoolean();
  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected} >
        <TableCell >{index + 1}</TableCell>
        <TableCell >{asset?.asset_code}</TableCell>
        <TableCell >{moment(start_date).format("DD/MM/YYYY")}</TableCell>

        <TableCell >{sended_by}</TableCell>

        {/*<TableCell>{`${assigned_to?.firstName} ${assigned_to?.lastName}`}</TableCell>*/}
        <TableCell >{service_person} </TableCell>
        <TableCell >{service_person_contact} </TableCell>
        <TableCell >{remark} </TableCell>


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
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/*<TaskQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />*/}
<ServiceQuickEditForm currentUser={row} mutate={mutate} open={quickEdit.value} onClose={quickEdit.onFalse}/>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Task"
        content="Are you sure want to delete selected task?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
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

ServiceTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  index: PropTypes.number,
};
