import { useState } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { SettingTabType } from 'src/types/settings';

import Tabs from '../tabs';
import BodyApi from '../body-api';

const SettingsView = () => {
  const settings = useSettingsContext();

  const [tab, setTab] = useState<SettingTabType>('tokens');

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Настройки системы"
        links={[
          { name: 'Главная', href: paths.dashboard.root },
          { name: 'Настройки системы', href: paths.dashboard.settings.root },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs tab={tab} setTab={setTab} />
      <BodyApi />
    </Container>
  );
};

export default SettingsView;
