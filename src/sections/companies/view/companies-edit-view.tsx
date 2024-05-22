// @ts-nocheck
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetBrief, useGetFiles, useGetCompany } from 'src/api/company';

import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
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

  const { brief, briefLoading } = useGetBrief(id, lang);
  const { company, companyLoading } = useGetCompany(companyId, lang);
  const { files, filesLoading, mutate: updateFiles } = useGetFiles(companyId);

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
      {briefLoading || companyLoading || filesLoading ? (
        <Box
          sx={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <LoadingScreen />
        </Box>
      ) : (
        <CompaniesNewEditForm
          id={id}
          companyId={companyId}
          updateFiles={updateFiles}
          currentCompany={{ ...brief, ...company, images: files }}
          lang={lang}
        />
      )}
    </Container>
  );
}
