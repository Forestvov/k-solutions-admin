import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import NewsEditForm from '../news-edit-form';

const NewsCreateView = () => {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Создать новое событие"
        links={[
          {
            name: 'Событие',
            href: paths.dashboard.news.root,
          },
          {
            name: 'Создать',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <NewsEditForm />
    </Container>
  );
};

export default NewsCreateView;
