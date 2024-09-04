import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

// ----------------------------------------------------------------------

export default function AssetsTableToolbar({
  filters,
  onFilters,
  type,
  location,
  //
  stockOptions,
  publishOptions,
}) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters],
  );
  const handleFilterGender = useCallback(
    (event) => {
      onFilters(
        'type',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value,
      );
    },
    [onFilters],
  );
  const handleFilterLocation = useCallback(
    (event) => {
      onFilters(
        'location',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value,
      );
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
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Type</InputLabel>
          <Select
            multiple
            value={filters.type}
            onChange={handleFilterGender}
            input={<OutlinedInput label='Type' />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {type.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox disableRipple size='small' checked={filters.type.includes(option)} />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl><FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Location</InputLabel>
          <Select
            multiple
            value={filters.location}
            onChange={handleFilterLocation}
            input={<OutlinedInput label='Location' />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {location.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox disableRipple size='small' checked={filters.location.includes(option)} />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      </Stack>
      {/*<FormControl*/}
      {/*  sx={{*/}
      {/*    flexShrink: 0,*/}
      {/*    width: { xs: 1, md: 200 },*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <InputLabel>Stock</InputLabel>*/}

      {/*  <Select*/}
      {/*    multiple*/}
      {/*    value={stock}*/}
      {/*    onChange={handleChangeStock}*/}
      {/*    input={<OutlinedInput label="Stock" />}*/}
      {/*    renderValue={(selected) => selected.map((value) => value).join(', ')}*/}
      {/*    onClose={handleCloseStock}*/}
      {/*    sx={{ textTransform: 'capitalize' }}*/}
      {/*  >*/}
      {/*    {stockOptions.map((option) => (*/}
      {/*      <MenuItem key={option.value} value={option.value}>*/}
      {/*        <Checkbox disableRipple size="small" checked={stock.includes(option.value)} />*/}
      {/*        {option.label}*/}
      {/*      </MenuItem>*/}
      {/*    ))}*/}
      {/*  </Select>*/}
      {/*</FormControl>*/}

      {/*<FormControl*/}
      {/*  sx={{*/}
      {/*    flexShrink: 0,*/}
      {/*    width: { xs: 1, md: 200 },*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <InputLabel>Publish</InputLabel>*/}

      {/*  <Select*/}
      {/*    multiple*/}
      {/*    value={publish}*/}
      {/*    onChange={handleChangePublish}*/}
      {/*    input={<OutlinedInput label="Publish" />}*/}
      {/*    renderValue={(selected) => selected.map((value) => value).join(', ')}*/}
      {/*    onClose={handleClosePublish}*/}
      {/*    sx={{ textTransform: 'capitalize' }}*/}
      {/*  >*/}
      {/*    {publishOptions.map((option) => (*/}
      {/*      <MenuItem key={option.value} value={option.value}>*/}
      {/*        <Checkbox disableRipple size="small" checked={publish.includes(option.value)} />*/}
      {/*        {option.label}*/}
      {/*      </MenuItem>*/}
      {/*    ))}*/}
      {/*  </Select>*/}
      {/*</FormControl>*/}

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

AssetsTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  publishOptions: PropTypes.array,
  stockOptions: PropTypes.array,
};
