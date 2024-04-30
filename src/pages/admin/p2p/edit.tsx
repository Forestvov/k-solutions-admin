import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { P2PEditView } from 'src/sections/p2p/view';

const EditP2pPage = () => {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> P2P редактирование</title>
      </Helmet>

      <P2PEditView id={`${id}`} />
    </>
  );
};

export default EditP2pPage;
