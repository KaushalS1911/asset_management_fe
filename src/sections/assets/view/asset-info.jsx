import React, { useCallback, useState } from 'react';
import Iconify from '../../../components/iconify';
import { Container } from '@mui/system';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { Card } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from '../../../components/settings';
import { useParams } from 'react-router';
import { useGetSingleAssete } from '../../../api/assets';
import AssetsNewEditForm from '../assets-new-edit-form';
import AssetServiceInfo from '../asset-service-info';

const TABS = [
  {
    value: 'asset',
    label: 'Asset Details',
    icon: <Iconify icon='solar:user-id-bold' width={24} />,
  },
  {
    value: 'service',
    label: 'Service Details',
    icon: <Iconify icon='solar:users-group-rounded-bold' width={24} />,
  },

];

function AssetInfo(props) {
const {id} = useParams()
  const {singleAssets,mutate} = useGetSingleAssete(id)
  const [currentTab, setCurrentTab] = useState('asset');
  const settings = useSettingsContext();
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Service'
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Asset', href: paths.dashboard.assets.list },
            { name: 'Service' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {/*<Card*/}
        {/*  sx={{*/}
        {/*    mb: 3,*/}
        {/*    height: 290,*/}
        {/*  }}*/}
        {/*>*/}
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>
        {/*</Card>*/}

        {currentTab === 'asset' && <AssetsNewEditForm currentProduct={singleAssets} mutate={mutate} disable={true}/>}

        {currentTab === 'service' && <AssetServiceInfo id={id} />}

        {/*{currentTab === 'friends' && (*/}
        {/*  <ProfileFriends*/}
        {/*    friends={_userFriends}*/}
        {/*    searchFriends={searchFriends}*/}
        {/*    onSearchFriends={handleSearchFriends}*/}
        {/*  />*/}
        {/*)}*/}

        {/*{currentTab === 'gallery' && <ProfileGallery gallery={_userGallery} />}*/}
      </Container></>
  );
};

export default AssetInfo;
