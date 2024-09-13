import React, { useState, useEffect, useCallback } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';
import { useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import axios from 'axios';
import { paths } from 'src/routes/paths';
import Box from '@mui/material/Box';
import { useGetAssete } from '../../api/assets';
import { LoadingScreen } from '../../components/loading-screen';
import { ASSETS_API_URL } from '../../config-global';
import AmcModel from './amc-model';
import { useAuthContext } from '../../auth/hooks';
// ----------------------------------------------------------------------


export default function AMCNewEditForm({ expensesId, singleService }) {
  const router = useRouter();
  const { assets } = useGetAssete();
  const [loading, setLoading] = useState(false);
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const [assetName, setAssetName] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useAuthContext();
  const [codes, setAssetsCode] = useState([]);
  // const, setTaskData] = useState([]);
  useEffect(() => {
    if (assets && assets.length > 0) {
      const updatedAssets = assets.map((data) => ({
        label: data?.asset_code,
        value: data?._id,
      }));
      setAssetName(updatedAssets);
    }
  }, [assets]);


  const NewBlogSchema = Yup.object().shape({
    remark: Yup.string().required('Remark is required'),
    company_name: Yup.string().required('Sended by is required'),
    cost: Yup.string().required('Cost person is required'),
    company_contact: Yup.string().required('Person contact is required').min(10).max(10),
    start_date: Yup.mixed().nullable().required('Start date is required'),
    end_date: Yup.mixed().nullable().required('End date is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues: {
      remark: '',
      company_name: '',
      cost: '',
      company_contact: '',
      start_date: new Date(),
      end_date: null,
    },
  });
  const {
    reset,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;
  const fetchExpenseById = useCallback(async () => {
    try {
      if (singleService) {
        reset({
          remark: singleService?.remark,
          company_name: singleService?.company_name,
          cost: singleService?.cost,
          company_contact: singleService?.company_contact,
          start_date: new Date(singleService?.start_date),
          end_date: new Date(singleService?.end_date),
        });
        setAssetsCode([singleService?.asset?._id]);
      }
    } catch (error) {
      console.error('Failed to fetch expense:', error);
    }
  }, [singleService, reset, assetName]);

  useEffect(() => {
    fetchExpenseById();
  }, [singleService, reset, assetName]);

  const onSubmit = handleSubmit(async (data) => {
    const a = codes.map((item) => ({
      ...data,
      asset: item,
    }));
    try {
      setLoading(true);
      if (expensesId) {
        axios.put(`${ASSETS_API_URL}/${user._id}/contract/${expensesId}`, a).then((res) => {
          if (res.status === 200) {
            setLoading(false);
            enqueueSnackbar(res.data.message);
            router.push(paths.dashboard.amc.list);
          }
        }).catch((err) => {
          setLoading(false);
          enqueueSnackbar('Something want wrong', { variant: 'error' });
        });

      } else {
        axios.post(`${ASSETS_API_URL}/${user._id}/contract`, a).then((res) => {
          if (res.status === 201) {
            enqueueSnackbar(res.data.message);
            router.push(paths.dashboard.amc.list);

          }
            setLoading(false);
        }).catch((err) => {
          setLoading(false);
          enqueueSnackbar('Something want wrong', { variant: 'error' });
        });

      }
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            Asset, short description, Cost...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title='Details' />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box columnGap={2}
                 rowGap={3}
                 display='grid'
                 gridTemplateColumns={{
                   xs: 'repeat(1, 1fr)',
                   md: 'repeat(2, 1fr)',
                 }}>

              {/*<RHFAutocomplete*/}
              {/*  name="asset"*/}
              {/*  label="Asset Code"*/}
              {/*  fullWidth*/}
              {/*  options={assetName}*/}
              {/*  getOptionLabel={(option) => option.label}*/}
              {/*  renderOption={(props, option) => (*/}
              {/*    <li {...props} key={option.value}>*/}
              {/*      {option.label}*/}
              {/*    </li>*/}
              {/*  )}*/}
              {/*/>*/}
              <RHFTextField name='company_name' label='Company name' />
              <Stack spacing={1.5}>
                <Controller
                  name='start_date'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label={'Start Date'}
                      format='dd/MM/yyyy'
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
              <Stack spacing={1.5}>
                <Controller
                  name='end_date'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label={'End Date'}
                      format='dd/MM/yyyy'
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
              <RHFTextField name='company_contact' label='Company Contact' />
              <RHFTextField name='cost' label='Cost' />
              {/*<RHFTextField name="company_contact" label="Service Person Contact" />*/}
              {/*<RHFTextField name="company_name" label="Sended By" />*/}
            </Box>
            <RHFTextField name='remark' multiline rows={4} label='Remark' />
            <Box columnGap={2}
                 rowGap={3}
                 display='grid'
                 gridTemplateColumns={{
                   xs: 'repeat(1, 1fr)',
                   md: 'repeat(4, 1fr)',
                 }}>
              <Button variant={'contained'} onClick={() => setOpen(true)}>Select Our Assets</Button>
              {/*<RHFAutocomplete*/}
              {/*  name="status"*/}
              {/*  label="Status"*/}
              {/*  fullWidth*/}
              {/*  options={['in amc','completed','not repairable']}*/}
              {/*  getOptionLabel={(option) => option}*/}
              {/*  renderOption={(props, option) => (*/}
              {/*    <li {...props} key={option}>*/}
              {/*      {option}*/}
              {/*    </li>*/}
              {/*  )}*/}
              {/*/>*/}
            </Box>
          </Stack>
        </Card>
        <Stack sx={{ my: '30px', alignItems: 'flex-end' }}>
          <Button type='submit' variant='contained' disabled={codes.length == 0}>
            Submit
          </Button>
        </Stack>
      </Grid>
    </>
  );

  return (
    <>
      {loading ? <LoadingScreen /> : <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {renderDetails}
        </Grid>
      </FormProvider>}
      <AmcModel open={open} setOpen={setOpen} setAssetsCode={setAssetsCode} codes={codes} />
    </>
  );
};

AMCNewEditForm.propTypes = {
  expensesId: PropTypes.string,
};
