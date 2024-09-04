import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ServiceNewEditForm from '../service-new-edit-form';
import { useParams } from 'react-router';
import { useGetSingleService } from '../../../api/service';

// ----------------------------------------------------------------------

export default function ServiceEditView() {
  const settings = useSettingsContext();
  const {id} = useParams()
  const {singleService} = useGetSingleService(id)

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Service',
            href: paths.dashboard.service.list,
          },
          { name: 'Form' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ServiceNewEditForm expensesId={id} singleService={singleService}/>
    </Container>
  );
}

ServiceEditView.propTypes = {
  id: PropTypes.string,
};
