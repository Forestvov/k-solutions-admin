import { Helmet } from 'react-helmet-async';

import { CompanyCreate } from 'src/sections/companies/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Создание компании</title>
      </Helmet>

      <CompanyCreate />
    </>
  );
}
