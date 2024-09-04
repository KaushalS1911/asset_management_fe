import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AssetsNewEditForm from '../assets-new-edit-form';

// ----------------------------------------------------------------------

export default function AssetsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={'lg'}>
      <CustomBreadcrumbs
        heading="Create a new assets"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Assets',
            href: paths.dashboard.assets.list,
          },
          { name: 'New Asset' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AssetsNewEditForm />
    </Container>
  );
}
