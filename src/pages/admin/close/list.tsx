import { Helmet } from 'react-helmet-async';

import { CloseListView } from 'src/sections/close/view';

// ----------------------------------------------------------------------

export default function CloseListPage() {
  return (
    <>
      <Helmet>
        <title> Заявки на закрытие кредитования</title>
      </Helmet>

      <CloseListView />
    </>
  );
}
