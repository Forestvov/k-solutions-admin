import { Helmet } from 'react-helmet-async';

import { NewListView } from 'src/sections/news/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Новости</title>
      </Helmet>

      <NewListView />
    </>
  );
}
