export const USER_STATUS: Record<string, string> = {
  Disable: 'Заблокирован',
  Enable: 'Доступен',
  Canceled: 'Отменен',
  Verified: 'Верефицирован',
  Process: 'В обработке',
  'Not verified email': 'Почта не подтверждена',
  'Not verified YC': 'Нет запроса на верификацию',
};


type USER_STATUS_VERIFICATION_TYPE = {
  name: string
  label: string
}

export const USER_STATUS_VERIFICATION: USER_STATUS_VERIFICATION_TYPE[] = [
  {
    name: 'Disable', label: 'Заблокирован'
  },
  {
    name: 'Canceled', label: 'Отменен'
  },
  {
    name: 'Verified', label: 'Верефицирован'
  },
  {
    name: 'Process', label: 'В обработке'
  }
]
