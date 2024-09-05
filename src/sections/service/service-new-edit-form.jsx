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
import { useGetSingleService } from '../../api/service';
import {LoadingScreen} from "../../components/loading-screen";
import { ASSETS_API_URL } from '../../config-global';
// ----------------------------------------------------------------------


export default function ServiceNewEditForm({ expensesId,singleService }) {
  const router = useRouter();
  const {assets} = useGetAssete()
  const [loading,setLoading] = useState(false)
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const [assetName,setAssetName] = useState([])
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
    asset: Yup.mixed().required('Asset is required'),
    remark: Yup.string().required('Remark is required'),
    sended_by: Yup.string().required('Sended by is required'),
    service_by: Yup.string().required('Service by is required'),
    service_person: Yup.string().required('Service person is required'),
    service_person_contact: Yup.string().required('Person contact is required').min(10).max(10),
    status: Yup.string().required('Status is required'),
    start_date: Yup.mixed().nullable().required('Start date is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues: {
      asset: null,
      remark: '',
      sended_by: '',
      service_by: '',
      service_person: '',
      service_person_contact: '',
      status: '',
      start_date: new Date(),
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
          asset: assetName.find((data) => data.value === singleService?.asset),
          remark: singleService?.remark,
          sended_by: singleService?.sended_by,
          service_by: singleService?.service_by,
          service_person: singleService?.service_person,
          service_person_contact: singleService?.service_person_contact,
          status: singleService?.status,
          start_date: new Date(singleService?.start_date),
        });
      }
    } catch (error) {
      console.error('Failed to fetch expense:', error);
    }
  }, [singleService, reset, assetName]);

  useEffect(() => {
    fetchExpenseById();
  }, [singleService, reset,assetName]);

  const onSubmit = handleSubmit(async (data) => {
setLoading(true)
    try {
      if(expensesId){
        axios.put(`${ASSETS_API_URL}/service/${expensesId}`,{...data,asset:data.asset.value}).then((res) => {
        if(res.status === 200){
          setLoading(false)
          enqueueSnackbar(res.data.message)
          router.push(paths.dashboard.service.list)
        }
      }).catch((err) => {
        setLoading(false)
          enqueueSnackbar("Something want wrong", {variant: "error"})
        })

      }else {
      axios.post(`${ASSETS_API_URL}/service`,{...data,asset:data.asset.value}).then((res) => {
        if(res.status === 201){
          setLoading(false)
          enqueueSnackbar(res.data.message)
          router.push(paths.dashboard.service.list)

        }
      }).catch((err) => {
        setLoading(false)
        enqueueSnackbar("Something want wrong", {variant: "error"})
      })

      }
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, Amount...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box  columnGap={2}
                  rowGap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                  }}>

              <RHFAutocomplete
                name="asset"
                label="Asset Code"
                fullWidth
                options={assetName}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
              />
              <Stack spacing={1.5}>
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label={"Start Date"}
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
              <RHFTextField name="service_by" label="Service By" />
              <RHFTextField name="service_person" label="Service Person" />
              <RHFTextField name="service_person_contact" label="Service Person Contact" />
              <RHFTextField name="sended_by" label="Sended By" />
                        </Box>
              <RHFTextField name="remark" multiline rows={4} label="Remark" />
              <Box columnGap={2}
                   rowGap={3}
                   display="grid"
                   gridTemplateColumns={{
                     xs: 'repeat(1, 1fr)',
                     md: 'repeat(2, 1fr)',
                   }}>
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
        </Card>
        <Stack sx={{ my: '30px', alignItems: 'flex-end' }}>
          <Button type="submit" variant="contained">
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
    </>
  );
};

ServiceNewEditForm.propTypes = {
  expensesId: PropTypes.string,
};
