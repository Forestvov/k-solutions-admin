import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { CompanyEdit } from 'src/sections/companies/view';

// ----------------------------------------------------------------------

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Page() {
  const params = useParams();
  const query = useQuery();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title>Компании</title>
      </Helmet>

      <CompanyEdit id={`${id}`} companyId={`${query?.get('companyId')}`} />
    </>
  );
}
