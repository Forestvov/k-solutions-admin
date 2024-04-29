import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetCompany } from 'src/api/company';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CompaniesNewEditForm from '../companies-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ProductEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { brief } = useGetCompany(id);

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
          { name: 'Редактирование' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
        <CompaniesNewEditForm currentCompany={brief} />
    </Container>
  );
}
