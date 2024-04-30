import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // ----------------------------------------------------------------------
      {
        subheader: 'Обзор',
        items: [
          { title: 'one', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'two', path: paths.dashboard.two, icon: ICONS.ecommerce },
          {
            title: 'three',
            path: paths.dashboard.three,
            icon: ICONS.analytics,
          },
        ],
      },

      // ----------------------------------------------------------------------
      {
        subheader: 'Управление',
        items: [
          {
            title: 'Пользователи',
            path: paths.dashboard.user.list,
            icon: ICONS.user,
            children: [{ title: 'Cписок', path: paths.dashboard.user.list }],
          },
          {
            title: 'Компании',
            path: paths.dashboard.companies.root,
            icon: ICONS.invoice,
            children: [
              { title: 'Список', path: paths.dashboard.companies.root },
              { title: 'Создать новую', path: paths.dashboard.companies.create },
            ],
          },
          {
            title: 'Транзакции',
            path: paths.dashboard.transaction.root,
            icon: ICONS.order,
            children: [{ title: 'Список', path: paths.dashboard.transaction.root }],
          },
          {
            title: 'p2p',
            path: paths.dashboard.p2p.list,
            icon: ICONS.order,
            children: [{ title: 'Список', path: paths.dashboard.p2p.list }],
          },
          {
            title: 'События',
            path: paths.dashboard.news.root,
            icon: ICONS.blog,
            children: [
              { title: 'Список', path: paths.dashboard.news.root },
              { title: 'Создать новую', path: paths.dashboard.news.create },
            ],
          },
          {
            title: 'Настройка системы',
            path: paths.dashboard.settings.root,
            icon: ICONS.analytics,
            children: [
              { title: 'Конфигурация', path: paths.dashboard.settings.root },
            ],
          },
        ],
      },
    ],
    []
  );

  return data;
}
