// @ts-nocheck
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetBrief, useGetFiles, useGetCompany } from 'src/api/company';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CompaniesNewEditForm from '../companies-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
  companyId: string;
  lang: string;
};

export default function ProductEditView({ id, companyId, lang }: Props) {
  const settings = useSettingsContext();

  const { brief } = useGetBrief(id, lang);
  const { company } = useGetCompany(companyId, lang);
  const { files, mutate: updateFiles } = useGetFiles(companyId);

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
      <CompaniesNewEditForm id={id} companyId={companyId} updateFiles={updateFiles} currentCompany={{ ...brief, ...company, images: files }} lang={lang} />
    </Container>
  );
}
