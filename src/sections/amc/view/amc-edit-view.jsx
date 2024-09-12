import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useParams } from 'react-router';
import AMCNewEditForm from '../amc-new-edit-form';
import { useGetSingleContract } from '../../../api/amc';

// ----------------------------------------------------------------------

export default function AMCEditView() {
  const settings = useSettingsContext();
  const {id} = useParams()
  const {singleContract} = useGetSingleContract(id)

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
            name: 'AMC',
            href: paths.dashboard.amc.list,
          },
          { name: 'Form' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AMCNewEditForm expensesId={id} singleService={singleContract}/>
    </Container>
  );
}

AMCEditView.propTypes = {
  id: PropTypes.string,
};
