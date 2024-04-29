import { Helmet } from 'react-helmet-async';

import { NewsCreateView } from 'src/sections/news/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Новость - Создать</title>
      </Helmet>

      <NewsCreateView />
    </>
  );
}
