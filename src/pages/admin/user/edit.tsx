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
        title="Пользователь"
        src={`http://185.215.186.138:8082/${id}/personal`}
        height="100%"
        width="100%"
      />
    </>
  );
}
