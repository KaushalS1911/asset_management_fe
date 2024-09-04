import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetProduct } from 'src/api/product';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AssetsNewEditForm from '../assets-new-edit-form';
import { useParams } from 'react-router';
import { useGetSingleAssete } from '../../../api/assets';

// ----------------------------------------------------------------------

export default function AssetsEditView() {
  const settings = useSettingsContext();
const {id} = useParams()
  const { singleAssets,mutate } = useGetSingleAssete(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Asset',
            href: paths.dashboard.assets.list,
          },
          { name: 'Edit' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AssetsNewEditForm currentProduct={singleAssets} mutate={mutate}/>
    </Container>
  );
}

AssetsEditView.propTypes = {
  id: PropTypes.string,
};
