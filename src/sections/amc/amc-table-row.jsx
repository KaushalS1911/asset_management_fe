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
import AMCQuickEditForm from './amc-quick-edit-form';

// ----------------------------------------------------------------------

export default function AMCTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  index,
}) {
  const { company_name,company_contact, start_date ,remark,cost,end_date} = row;
  const confirm = useBoolean();
  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected} >
        <TableCell >{index + 1}</TableCell>
        <TableCell >{company_name}</TableCell>

        <TableCell >{company_contact}</TableCell>

        {/*<TableCell>{`${assigned_to?.firstName} ${assigned_to?.lastName}`}</TableCell>*/}
        <TableCell >{cost} </TableCell>
        <TableCell >{moment(start_date).format("DD/MM/YYYY")}</TableCell>
        <TableCell >{moment(end_date).format("DD/MM/YYYY")}</TableCell>
        <TableCell >{remark} </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {/*<Tooltip title="Quick Edit" placement="top" arrow>*/}
          {/*  <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>*/}
          {/*    <Iconify icon="solar:pen-bold" />*/}
          {/*  </IconButton>*/}
          {/*</Tooltip>*/}
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/*<TaskQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />*/}
<AMCQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse}/>
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
        title="Delete"
        content="Are you sure want to delete selected item?"
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

AMCTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  index: PropTypes.number,
};
