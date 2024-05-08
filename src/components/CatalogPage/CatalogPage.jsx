import React from 'react';
import Header from '../Header/Header';
import CatalogTable from '../CatalogTable/CatalogTable';

const CatalogPage = ({ user }) => {
  return (
    <>
      <Header user={user} />
      <CatalogTable user={user} />
    </>
  );
}

export default CatalogPage;
