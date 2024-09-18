import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm,Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox, RHFRadioGroup,
} from 'src/components/hook-form';
import { Upload } from '../../components/upload';
import scrollbar from '../../components/scrollbar';
import Scrollbar from '../../components/scrollbar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, FormHelperText } from '@mui/material';
import axios from 'axios';
import {LoadingScreen} from "../../components/loading-screen";
import { ASSETS_API_URL } from '../../config-global';
import { useAuthContext } from '../../auth/hooks';
import { useGetConfigs } from '../../api/config';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function AssetsNewEditForm({ currentProduct,mutate,disable }) {
  const {user} = useAuthContext()
  const router = useRouter();
  //  const PRODUCT_GENDER_OPTIONS = [
  //   { label: 'Men', value: 'Men' },
  //   { label: 'Women', value: 'Women' },
  //   { label: 'Kids', value: 'Kids' },
  // ];
  const PRODUCT_GENDER_OPTIONS = [
    { label: 'New', value: 'New' },
    { label: 'Refurbish', value: 'Refurbish' },
  ];
  const PRODUCT_WARRANTY_OPTIONS = [
    { label: 'In Warranty', value: 'in_warranty' },
    { label: 'Out of warranty', value: 'out_of_warranty' },
  ];
const [loading,setLoading] = useState(false)
  const [file, setFile] = useState(currentProduct?.image_url || null);
const {config} = useGetConfigs()
  const [type,setType] = useState([])
  const [name,setName] = useState([])
  const [company,setCompany] = useState([])
  const [file1, setFile1] = useState(currentProduct?.invoice_url || null);
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const [selectedAssetType, setSelectedAssetType] = useState(currentProduct?.asset_type || '');
  const [includeTaxes, setIncludeTaxes] = useState(false);
  const [warrantyStatus, setWarrantyStatus] = useState(currentProduct?.in_warranty == true ? "in_warranty" : "out_of_warranty" || '');
useEffect(() => {
  if(config?.asset_types){
    setType(config?.asset_types)
    setName(config?.asset_name)
    setCompany(config?.company)
  }
} ,[config])
  const NewProductSchema = Yup.object().shape({
    // image_url: Yup.mixed().nullable().required('Image is required'),
    asset_name: Yup.string().required('Name is required'),
    asset_type: Yup.string().required('Asset type is required'),
    asset_code: Yup.string().required('Asset code is required'),
    company: Yup.string().required('Company is required'),
    seller_name: Yup.string().required('Seller name is required'),
    person_name: Yup.string().required('Person name is required'),
    seller_contact: Yup.string().required('Seller contact is required').min(10).max(10),
    seller_company: Yup.string().required('Seller company is required'),
    new_refurbish: Yup.string().required('New/Refurbish status is required'),
    // warranty_start_date: Yup.mixed().nullable().required('Warranty start date is required'),
    // warranty_end_date: Yup.mixed().nullable().required('Warranty end date is required'),
    location: Yup.string().required('Location is required'),
    invoice_no: Yup.string().required('Invoice number is required'),
    // invoice_url: Yup.mixed().required('Invoice is required'),
    in_warranty: Yup.string().required('Warranty is required'),
    purchase_date: Yup.mixed().nullable().required('Expired date is required'),
  });
  const images = [
    {
      url: currentProduct?.image_url || null,
      name: 'asset.jpg',
    },
    {
      url: currentProduct?.invoice_url || null,
      name: 'invoice.jpg',
    },

  ];
  const handleDownload = async () => {
    const zip = new JSZip();
    const imageFolder = zip.folder('images');

    // Loop over the image URLs and add them to the zip
    await Promise.all(
      images.map(async (item, index) => {
        const response = await fetch(item?.url);
        const blob = await response.blob();
        imageFolder.file(`image-${index + 1}.jpg`, blob);
      })
    );

    // Generate the zip file and trigger the download
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'images.zip');
    });
  }
  const defaultValues = useMemo(
    () => ({
      image_url: currentProduct?.image_url || null,
      asset_name: currentProduct?.asset_name || '',
      asset_type: currentProduct?.asset_type || '',
      asset_code: currentProduct?.asset_code || '',
      company: currentProduct?.company || '',
      seller_name: currentProduct?.seller_name || '',
      person_name: currentProduct?.person_name || '',
      seller_company: currentProduct?.seller_company || '',
      seller_contact: currentProduct?.seller_contact || '',
      new_refurbish: currentProduct?.new_refurbish || '',
      warranty_start_date: currentProduct && new Date(currentProduct?.warranty_start_date) || null,
      warranty_end_date: currentProduct && new Date(currentProduct?.warranty_end_date) || null,
      vehicle_insurance_start_date: currentProduct && new Date(currentProduct?.vehicle_insurance_start_date) || null,
      vehicle_insurance_end_date: currentProduct && new Date(currentProduct?.vehicle_insurance_end_date) || null,
      location: currentProduct?.location || '',
      invoice_no: currentProduct?.invoice_no || '',
      invoice_url: currentProduct?.invoice_url || null,
      remark: currentProduct?.remark || '',
      purchase_date: currentProduct && new Date(currentProduct?.purchase_date) || new Date(),
      in_warranty:currentProduct && (currentProduct?.in_warranty == true ? "in_warranty" : "out_of_warranty") || '',

    }),
    [currentProduct]
  );

useEffect(() => {
  if(currentProduct){
    setFile(currentProduct?.image_url)
    setFile1(currentProduct?.invoice_url)
    setSelectedAssetType(currentProduct?.asset_type)
    setWarrantyStatus(currentProduct?.in_warranty == true ? "in_warranty" : "out_of_warranty" || '')
  }
},[currentProduct])
  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const handleWarrantyChange = (event) => {
    setWarrantyStatus(event.target.value);

  };
  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  // useEffect(() => {
  //   if (includeTaxes) {
  //     setValue('taxes', 0);
  //   } else {
  //     setValue('taxes', currentProduct?.taxes || 0);
  //   }
  // }, [currentProduct?.taxes, includeTaxes, setValue]);
  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setFile(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      );
    }
  }, []);
  const handleDropSingleFile1 = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setFile1(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      );
    }
  }, []);
  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
      const formData = new FormData();
    formData.append('asset_code', data.asset_code);
    formData.append('asset_name', data.asset_name);
    formData.append('asset_type', data.asset_type);
    formData.append('company', data.company);
    if (file) {
      formData.append('asset-image', file);
      // formData.append('image_url', file);
    }
    formData.append('invoice_no', data.invoice_no);
    if (file1) {
      formData.append('invoice-image', file1);
    }
    formData.append('location', data.location);
    formData.append('new_refurbish', data.new_refurbish);
    formData.append('person_name', data.person_name);
    formData.append('purchase_date', data.purchase_date);
    formData.append('remark', data.remark);
    formData.append('seller_company', data.seller_company);
    // formData.append('seller_contact', data.seller_contact);
    formData.append('seller_name', data.seller_name);
    formData.append('seller_contact', data.seller_contact);
    if(data.warranty_start_date && data.warranty_end_date){
    formData.append('warranty_start_date', data.warranty_start_date);
    formData.append('warranty_end_date', data.warranty_end_date);
    }
    if(data.vehicle_insurance_start_date && data.vehicle_insurance_end_date){
    formData.append('vehicle_insurance_start_date', data.vehicle_insurance_start_date);
    formData.append('vehicle_insurance_end_date', data.vehicle_insurance_end_date);
    }
    formData.append('in_warranty', data.in_warranty === "in_warranty" ? true : false);

    if(currentProduct){
    axios
      .put(`${ASSETS_API_URL}/${user._id}/asset/${currentProduct?._id}`, formData)
      .then((res) => {
        if (res) {
          mutate()
          setLoading(false)
          enqueueSnackbar(res?.data?.message);
          router.push(paths.dashboard.assets.list)
        }
      })
      .catch((err) => {
        setLoading(false)
        enqueueSnackbar('Something went wrong',{variant:'error'});
      });

    }else {

    axios
      .post(`${ASSETS_API_URL}/${user._id}/asset`, formData)
      .then((res) => {
        if (res.status == 201) {
          setLoading(false)
          enqueueSnackbar(res?.data?.message);
          router.push(paths.dashboard.assets.list)
        }
      })
      .catch((err) => {
        setLoading(false)
        enqueueSnackbar('Something went wrong',{variant:'error'});
      });

    }
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   reset();
    //   enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
    //   router.push(paths.dashboard.product.root);
    //   console.info('DATA', data);
    // } catch (error) {
    //   console.error(error);
    // }
  });
  const handleAssetTypeChange = (value) => {
    setSelectedAssetType(value);
  };
  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Asset Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
            {disable ? <Box mt={2} pr={2}> <img src={currentProduct?.image_url} alt='asset image' /> </Box> :
           <Box mt={2} pr={2}>
             <Controller
               disabled={disable}
               name='image_url'
               control={control}
               render={({ field, fieldState: { error } }) => (
                 <Upload
                   {...field}
                   file={file}
                   onDrop={handleDropSingleFile}
                   onDelete={() => setFile(null)}
                   error={!!error}
                   helperText={
                     (!!error) && (
                       <FormHelperText error={!!error} sx={{ px: 2 }}>
                         {error.message}
                       </FormHelperText>
                     )
                   }
                 />
               )}
             />
           </Box>}
          </Typography>
        </Grid>
      )}
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <>
            <Box sx={{display:"flex",justifyContent:'space-between',alignItems:'center'}}>
              <CardHeader title="Asset Details" />
              <Button variant='contained' sx={{py:"3px",mr:3}} onClick={handleDownload}><Iconify
                icon='eva:cloud-download-fill'
                sx={{ width: 24, height: 22, color: '#fff'}}
              /></Button>
            </Box>
            {disable ? <Box mt={2} px={3}> <img src={currentProduct?.image_url} alt='asset image' /> </Box> :
              <Box mt={2} px={3}>
                <Controller
                  disabled={disable}
                  name='image_url'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Upload
                      {...field}
                      file={file}
                      onDrop={handleDropSingleFile}
                      onDelete={() => setFile(null)}
                      error={!!error}
                      helperText={
                        (!!error) && (
                          <FormHelperText error={!!error} sx={{ px: 2 }}>
                            {error.message}
                          </FormHelperText>
                        )
                      }
                    />
                  )}
                />
              </Box>}
          </>
           }
          <Stack spacing={3} sx={{ p: 3 }} >
            <Stack spacing={1.5}>
              <Box sx={{display:"flex",justifyContent:'space-between',alignItems:'center'}}>
                <Typography variant="subtitle1">Assets Img</Typography>
                {(disable && mdUp) && <Button variant='contained' sx={{py:"3px"}} onClick={handleDownload}><Iconify
                  icon='eva:cloud-download-fill'
                  sx={{ width: 24, height: 22, color: '#fff'}}
                /></Button>}
              </Box>


            </Stack>
            <Box  columnGap={2}
                  rowGap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                  }}>

            {/*<RHFTextField disabled={disable} name="asset_name" label="Asset Name" />*/}
            {/*  <Controller*/}
            {/*    name="asset_name"*/}
            {/*    control={control}*/}
            {/*    defaultValue=""*/}
            {/*    render={({ field }) => (*/}
                    {/*{...field}*/}
                  <RHFAutocomplete
                name="asset_name"
                    disabled={disable}
                    label="Asset Name"
                    fullWidth
                    options={name}
                    getOptionLabel={(option) => option}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    )}

                  />
              {/*  )}*/}
              {/*/>*/}
              <Controller
                name="asset_type"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RHFAutocomplete
                    {...field}
                    disabled={disable}
                    label="Asset Type"
                    fullWidth
                    options={type}
                    getOptionLabel={(option) => option}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    )}
                    onChange={(event, value) => {
                      field.onChange(value);
                      handleAssetTypeChange(value)
                    }}
                  />
                )}
              />
              {/*<Controller*/}
              {/*  name="asset_type"*/}
              {/*  control={control}*/}
              {/*  render={({ field }) => (*/}
              {/*    <RHFAutocomplete*/}
              {/*      {...field}*/}
              {/*      disabled={disable}*/}
              {/*      label="Asset Type"*/}
              {/*      fullWidth*/}
              {/*      options={['Speaker', 'Keyboard', 'Mouse', 'Monitor', 'Light', 'Fan', 'Cable', 'Chair', 'Vehicle']}*/}
              {/*      getOptionLabel={(option) => option}*/}
              {/*      renderOption={(props, option) => (*/}
              {/*        <li {...props} key={option}>*/}
              {/*          {option}*/}
              {/*        </li>*/}
              {/*      )}*/}
              {/*      onChange={(event) => {*/}
              {/*        field.onChange(event);*/}
              {/*        handleAssetTypeChange(event);*/}
              {/*      }}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*/>*/}
            <RHFTextField disabled={disable} name="asset_code" label="Asset Code" />
            {/*<RHFTextField disabled={disable} name="company" label="Company" />*/}
            {/*  <Controller*/}
            {/*    control={control}*/}
            {/*    defaultValue=""*/}
            {/*    render={({ field }) => (*/}
            {/*        {...field}*/}
                  <RHFAutocomplete
                    name="company"
                    disabled={disable}
                    label="Company"
                    fullWidth
                    options={company}
                    getOptionLabel={(option) => option}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    )}

                  />
              {/*  )}*/}
              {/*/>*/}
              <Stack spacing={1.5}>
                <Controller disabled={disable}
                  name="purchase_date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label={"Purchase Date"}
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
              <RHFAutocomplete disabled={disable}
                name="new_refurbish"
                label="New / Refurbish"
                fullWidth
                options={["New","Refurbish"]}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
              <RHFAutocomplete disabled={disable}
                name="location"
                label="Location"
                fullWidth
                options={['Developer', 'Lab 1', 'Lab 2']}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            <RHFTextField disabled={disable} name="person_name" label="Person Name" />
              <Stack >
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Warranty Information</Typography>
                  <Controller disabled={disable}
                    name="in_warranty"
                    control={control}
                    render={({ field }) => (
                      <RHFRadioGroup disabled={disable}
                        {...field}
                        row
                        options={PRODUCT_WARRANTY_OPTIONS}
                        onChange={(event) => {
                          field.onChange(event);
                          handleWarrantyChange(event);
                        }}
                      />
                    )}
                  />
                </Stack>
              </Stack>
              <RHFTextField disabled={disable} name="remark" multiline rows={3} label="Remark" />
            </Box>

          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderInvoice = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Billing Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Upload the invoice or other documents...
          </Typography>
          {disable ? <Box mt={2} pr={2}> <img src={currentProduct?.invoice_url} alt='asset image' /> </Box> :
          <Box mt={2} pr={2}>
            <Controller disabled={disable}
                        name="invoice_url"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <Upload
                            {...field}
                            file={file1}
                            onDrop={handleDropSingleFile1}
                            onDelete={() => setFile1(null)}
                            error={!!error}
                            helperText={
                              (!!error) && (
                                <FormHelperText error={!!error} sx={{ px: 2 }}>
                                  {error.message}
                                </FormHelperText>
                              )
                            }
                          />
                        )}
            />
          </Box>}
        </Grid>
      )}
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <>
            <CardHeader title="Billing Details" />
            {disable ? <Box mt={2} px={3}> <img src={currentProduct?.invoice_url} alt='asset image' /> </Box> :
              <Box mt={2} px={3}>
                <Controller disabled={disable}
                            name="invoice_url"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <Upload
                                {...field}
                                file={file1}
                                onDrop={handleDropSingleFile1}
                                onDelete={() => setFile1(null)}
                                error={!!error}
                                helperText={
                                  (!!error) && (
                                    <FormHelperText error={!!error} sx={{ px: 2 }}>
                                      {error.message}
                                    </FormHelperText>
                                  )
                                }
                              />
                            )}
                />
              </Box>}
          </>}
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle1">Upload Invoice</Typography>
              {/*<Upload*/}
              {/*  name="invoice_url"*/}
              {/*  file={file1}*/}
              {/*  onDrop={handleDropSingleFile1}*/}
              {/*  onDelete={() => setFile1(null)}*/}
              {/*/>*/}
            </Stack>
            <Box  columnGap={2}
                  rowGap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                  }}>
              <RHFTextField disabled={disable} name="seller_name" label="Seller Name" />
              <RHFTextField disabled={disable} name="seller_company" label="Seller Company" />
              <RHFTextField disabled={disable} name="seller_contact" label="Seller Contact" />
              <RHFTextField disabled={disable} name="invoice_no" label="Invoice No" />
              {warrantyStatus === 'in_warranty' && (
                              <Stack spacing={1.5}>
                    <Controller
                      name="warranty_start_date"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          {...field}
                          format="dd/MM/yyyy"
                          label={"Warranty Start Date"}
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
              )}
              {warrantyStatus === 'in_warranty' && (   <Stack spacing={1.5}>
                    <Controller
                      disabled={disable}
                      name="warranty_end_date"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          {...field}
                          format="dd/MM/yyyy"
                          label={"Warranty End Date"}
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
                  </Stack>)}
              {selectedAssetType === 'Vehicles' && (
                              <Stack spacing={1.5}>
                    <Controller
                      disabled={disable}
                      name="vehicle_insurance_start_date"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          {...field}
                          format="dd/MM/yyyy"
                          label={"Vehicle insurance start date"}
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
              )}
              {selectedAssetType === 'Vehicles' && (   <Stack spacing={1.5}>
                    <Controller
                      name="vehicle_insurance_end_date"
                      control={control}
                      disabled={disable}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          {...field}
                          format="dd/MM/yyyy"
                          label={"Vehicle insurance end date"}
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
                  </Stack>)}
                           </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained"  loading={isSubmitting}>
          {!currentProduct ? 'Create Asset' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <>
      {loading ? <LoadingScreen /> :  <FormProvider methods={methods} onSubmit={onSubmit}>

      <Grid container spacing={3}>

        {renderDetails}

        {/*{renderProperties}*/}

        {renderInvoice}

        {!disable && renderActions}
      </Grid>
    </FormProvider> }
    </>
  );
};

AssetsNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
