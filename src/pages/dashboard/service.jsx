import React from 'react';
import { Helmet } from 'react-helmet-async';
import ServiceListView from '../../sections/service/view/service-list-view';

function ServiceListPage(props) {
  return (
    <>
      <Helmet>
        <title> Dashboard: Service</title>
      </Helmet>
      <ServiceListView />
    </>
  );
}

export default ServiceListPage;
