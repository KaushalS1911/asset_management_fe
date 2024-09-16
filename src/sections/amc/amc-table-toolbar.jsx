import PropTypes from 'prop-types';
import { useCallback } from 'react';
import {useState} from 'react';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import Iconify from 'src/components/iconify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import moment from 'moment';

// ----------------------------------------------------------------------

export default function AMCTableToolbar({
                                              filters,
                                              onFilters,
                                              roleOptions,
                                          dateError
                                            }) {
  const popover = usePopover();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters],
  );

  const handleFilterRole = useCallback(
    (event) => {
      onFilters(
        'role',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value,
      );
    },
    [onFilters],
  );
  const handleFilterStartDate = useCallback(
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        onFilters('startDate', null);
        return;
      }

      const date = moment(newValue);

      if (date.isValid()) {
        onFilters('startDate', date.toDate());
      } else {
        console.warn('Invalid date selected');
        onFilters('startDate', null);
      }
    },
    [onFilters],
  );
  const handleFilterEndDate = useCallback(
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        onFilters('endDate', null);
        return;
      }

      const date = moment(newValue);

      if (date.isValid()) {
        onFilters('endDate', date.toDate());
      } else {
        console.warn('Invalid date selected');
        onFilters('endDate', null);
      }
    },
    [onFilters],
  );


  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 2.5 },
        }}
      >
        <DatePicker
          label="Start date"
          value={filters.startDate ? moment(filters.startDate).toDate() : null}
          open={startDateOpen}
          onClose={() => setStartDateOpen(false)}
          onChange={handleFilterStartDate}
          slotProps={{
            textField: {
              onClick: () => setStartDateOpen(true),
              fullWidth: true,
            },
          }}
          sx={{
            maxWidth: { md: 200 },
          }}
        />
        <DatePicker
          label="End date"
          value={filters.endDate}
          open={endDateOpen}
          onClose={() => setEndDateOpen(false)}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              onClick: () => setEndDateOpen(true),
              fullWidth: true,
              error: dateError,
              helperText: dateError && 'End date must be later than start date',
            },
          }}
          sx={{
            maxWidth: { md: 200 },
            [`& .${formHelperTextClasses.root}`]: {
              position: { md: 'absolute' },
              bottom: { md: -40 },
            },
          }}
        />
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        {/* <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Expense Type</InputLabel>
          <Select
            multiple
            value={filters.role}
            onChange={handleFilterRole}
            input={<OutlinedInput label="Expense Type" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {roleOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox disableRipple size="small" checked={filters.role.includes(option)} />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

AMCTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
};
