import { StatusType } from 'src/types/company';

const statuses = {
  'In progress': 'Идет сбор ',
  'Collection completed': 'Сбор завершен',
  'Loan payed': 'Займ погашен',
  '': '',
};

const getLabelStatus = (status: StatusType): string => statuses[status] ?? '';

export default getLabelStatus;
