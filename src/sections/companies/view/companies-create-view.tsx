import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CompaniesNewEditForm from '../companies-new-edit-form';
import { useSettingsContext } from '../../../components/settings';

// ----------------------------------------------------------------------

export default function ProductCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Компании"
        links={[
          {
            name: 'Главная',
            href: paths.dashboard.root,
          },
          {
            name: 'Компании',
            href: paths.dashboard.companies.root,
          },
          { name: 'Создание компании' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CompaniesNewEditForm />
    </Container>
  );
}
