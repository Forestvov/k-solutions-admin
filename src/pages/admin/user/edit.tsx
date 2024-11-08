import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { VITE_CLIENT_DOMEN } from 'src/config-global';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title>Пользователь</title>
      </Helmet>

      <iframe
        frameBorder={0}
        title="Пользователь"
        src={`${VITE_CLIENT_DOMEN}/#/${id}/personal`}
        height="100%"
        width="100%"
      />
    </>
  );
}
