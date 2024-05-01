import { Helmet } from 'react-helmet-async';

import { UserVerificationView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserVerificationPage() {
  return (
    <>
      <Helmet>
        <title> Верификация пользователей</title>
      </Helmet>

      <UserVerificationView />
    </>
  );
}
