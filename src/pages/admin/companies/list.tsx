import { Helmet } from 'react-helmet-async';

import { CompaniesList } from 'src/sections/companies/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Компании</title>
      </Helmet>

      <CompaniesList />
    </>
  );
}
