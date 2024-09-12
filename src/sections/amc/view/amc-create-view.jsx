import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import AMCNewEditForm from '../amc-new-edit-form';


// ----------------------------------------------------------------------

export default function AMCCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new AMC"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'AMC',
            href: paths.dashboard.amc.list,
          },
          { name: 'New AMC' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <AMCNewEditForm />
    </Container>
  );
}
