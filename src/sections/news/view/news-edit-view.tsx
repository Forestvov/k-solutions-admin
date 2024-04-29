import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetNew } from 'src/api/news';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import NewsEditForm from '../news-edit-form';

interface Prop {
  id: string;
}

const NewsEditView = ({ id }: Prop) => {
  const settings = useSettingsContext();

  const { newData } = useGetNew(id, 'ru');

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Обновить событие"
        links={[
          {
            name: 'Событие',
            href: paths.dashboard.news.root,
          },
          {
            name: 'Редактирование',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <NewsEditForm currentPost={newData} />
    </Container>
  );
};

export default NewsEditView;
