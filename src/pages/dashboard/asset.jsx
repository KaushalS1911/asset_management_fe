import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AssetsListView } from '../../sections/assets/view';

function AssetListPage(props) {
  return (
    <>
      <Helmet>
        <title> Dashboard: Assets</title>
      </Helmet>
      <AssetsListView />

    </>
  );
}

export default AssetListPage;
