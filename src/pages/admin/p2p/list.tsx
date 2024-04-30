import { Helmet } from 'react-helmet-async';

import { P2PListView } from 'src/sections/p2p/view';

// ----------------------------------------------------------------------

export default function P2pListPage() {
  return (
    <>
      <Helmet>
        <title> p2p Лист</title>
      </Helmet>

      <P2PListView />
    </>
  );
}
