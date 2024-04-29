import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import NewsEditView from 'src/sections/news/view/news-edit-view';

// ----------------------------------------------------------------------

export default function Page() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title>Новость</title>
      </Helmet>

      <NewsEditView id={`${id}`} />
    </>
  );
}
