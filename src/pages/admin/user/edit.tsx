import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

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
        src={`https://k-solutions.ltd/#/${id}/personal`}
        height="100%"
        width="100%"
      />
    </>
  );
}
