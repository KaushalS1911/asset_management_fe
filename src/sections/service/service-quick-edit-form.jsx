import * as Yup from 'yup';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { countries } from 'src/assets/data';
import { USER_STATUS_OPTIONS } from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { paths } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function ServiceQuickEditForm({ currentUser, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    end_date: Yup.mixed().nullable().required('Enf date is required'),
    service_cost: Yup.number().required('Service cost is required'),
    received_by: Yup.string().required('Received by is required'),
    status: Yup.string().required('Status is required'),
    receiver_contact: Yup.string().required('Receiver contact is required').min(10).max(10),

  });

  const defaultValues = useMemo(
    () => ({
      end_date: new Date() || new Date(),
      service_cost: currentUser?.service_cost || '',
      received_by: currentUser?.received_by || '',
      receiver_contact: currentUser?.receiver_contact || '',
      status: currentUser?.status,
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      axios.put(`https://asset-management-be-dkf8.onrender.com/service/${currentUser?._id}`,{...data}).then((res) => {
        if(res.status === 200){
          enqueueSnackbar(res.data.message)
          onClose()          // router.push(paths.dashboard.service.list)
        }
      }).catch((err) => enqueueSnackbar("Something want wrong",{variant:"error"}))
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box  columnGap={2}
                  rowGap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                  }}>

              {/*<RHFTextField name="asset_name" label="Asset Name" />*/}
              {/*<RHFAutocomplete*/}
              {/*  name="asset"*/}
              {/*  label="Asset Name"*/}
              {/*  fullWidth*/}
              {/*  options={assetName}*/}
              {/*  getOptionLabel={(option) => option.label}*/}
              {/*  renderOption={(props, option) => (*/}
              {/*    <li {...props} key={option.value}>*/}
              {/*      {option.label}*/}
              {/*    </li>*/}
              {/*  )}*/}
              {/*/>*/}
              <Stack spacing={1.5}>
                <Controller
                  name="end_date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label={"End Date"}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Stack>
              <RHFTextField name="service_cost" label="Service Cost" />
              <RHFTextField name="received_by" label="Received By" />
              <RHFTextField name="receiver_contact" label="Receiver Contact" />

              {/*<Stack spacing={1}>*/}
              {/*  <Stack spacing={1}>*/}
              {/*    <Typography variant="subtitle2">Warranty Information</Typography>*/}
              {/*    <Controller*/}
              {/*      name="in_warranty"*/}
              {/*      control={control}*/}
              {/*      render={({ field }) => (*/}
              {/*        <RHFRadioGroup*/}
              {/*          {...field}*/}
              {/*          row*/}
              {/*          options={PRODUCT_WARRANTY_OPTIONS}*/}
              {/*          onChange={(event) => {*/}
              {/*            field.onChange(event);*/}
              {/*            handleWarrantyChange(event);*/}
              {/*          }}*/}
              {/*        />*/}
              {/*      )}*/}
              {/*    />*/}
              {/*  </Stack>*/}
              {/*</Stack>*/}
              <RHFAutocomplete
                name="status"
                label="Status"
                fullWidth
                options={['in service','completed','not repairable']}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

ServiceQuickEditForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  currentUser: PropTypes.object,
};
