import { Helmet } from 'react-helmet-async';

import { TransactionListView } from 'src/sections/transaction/view';

export default function TransactionListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Transaction List</title>
      </Helmet>

      <TransactionListView />
    </>
  );
}
