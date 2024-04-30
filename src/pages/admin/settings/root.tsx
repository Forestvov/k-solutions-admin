import { Helmet } from 'react-helmet-async';

import { SettingView } from 'src/sections/settings/view';

export default function SettingsPage() {
  return (
    <>
      <Helmet>
        <title> Настройки</title>
      </Helmet>

      <SettingView />
    </>
  );
}
