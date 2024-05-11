export type SettingTabType = 'api' | 'tokens';

export interface SettingToken {
  currencyTypeId: number | '';
  currentName: string;
  value: string;
  image?: string;
  qrCode: string;
  staticCurse: string;
  transactionLinkType: string;
}
