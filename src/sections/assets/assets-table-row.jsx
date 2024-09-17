import PropTypes from 'prop-types';
import moment from 'moment';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function AssetsTableRow({ row, selected, onEditRow, onView, onDeleteRow ,index}) {
  const { asset_name, asset_code, image_url, asset_type, purchase_date, location, seller_name,person_name } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  const router = useRouter();

  return (
    <>
      <TableRow hover selected={selected}>


        <TableCell>{index+1}</TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center',cursor:"pointer" }} onClick={onView}>
          <Avatar alt={`${asset_name}`} src={image_url} sx={{ mr: 2 }} />
          {/*<TableCell sx={{ whiteSpace: 'nowrap' }}>{person_name}</TableCell>*/}
          <ListItemText
            primary={`${asset_name}`}
            secondary={""}
            primaryTypographyProps={{ typography: 'body2',fontWeight:600 }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{person_name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{asset_code}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{asset_type}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{location}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{seller_name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {moment(purchase_date).format('DD/MM/YYYY')}
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

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDeleteRow()
            confirm.onFalse();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

AssetsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
