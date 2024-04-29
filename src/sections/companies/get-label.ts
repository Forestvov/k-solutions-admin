import { CompanyType } from '../../types/company';

const getLabel = (type: CompanyType) => (type === 'Company' ? 'Компания' : 'Франшиза');

export default getLabel;
