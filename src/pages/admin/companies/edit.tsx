import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { CompanyEdit } from 'src/sections/companies/view';

// ----------------------------------------------------------------------

export default function Page() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title>Компании</title>
      </Helmet>

      <CompanyEdit id={`${id}`} />
    </>
  );
}
