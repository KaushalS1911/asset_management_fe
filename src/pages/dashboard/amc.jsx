import React from 'react';
import { Helmet } from 'react-helmet-async';
import AMCListView from '../../sections/amc/view/amc-list-view';

function AmcListPage(props) {
  return (
    <>
      <Helmet>
        <title> Dashboard: AMC</title>
      </Helmet>

      <AMCListView />
    </>
  );
}

export default AmcListPage;
