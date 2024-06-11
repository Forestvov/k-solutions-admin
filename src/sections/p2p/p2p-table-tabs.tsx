import { useContext, useCallback, SyntheticEvent } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';

import Label from '../../components/label';
import { CounterContext } from '../../counter/context';
import { IP2PTableFilters } from '../../types/transaction';

interface Prop {
  filters: IP2PTableFilters;
  options: {
    value: string;
    label: string;
  }[];
  onFilters: (name: string, value: string) => void;
}

const P2PTableTabs = ({ options, onFilters, filters }: Prop) => {
  const {
    cancelledCount,
    successCount,
    waitRequisitesCount,
    processCount,
    markAsPaidCount,
    supportCount,
  } = useContext(CounterContext);

  const handleFilterStatus = useCallback(
    (event: SyntheticEvent, newValue: string) => {
      console.log(event.target);
      onFilters('transactionStatus', newValue);
    },
    [onFilters]
  );

  const renderCount = (value: string) => {
    switch (value) {
      case 'all':
        return (
          cancelledCount +
          successCount +
          waitRequisitesCount +
          processCount +
          markAsPaidCount +
          supportCount
        );
      case 'Wait requisites':
        return +waitRequisitesCount;
      case 'Process':
        return +processCount;
      case 'Support':
        return +supportCount;
      case 'Marked as paid':
        return +markAsPaidCount;
      case 'Canceled':
        return +cancelledCount;
      case 'Success':
        return +successCount;
      default:
        return 'unknown';
    }
  };

  return (
    <Tabs
      value={filters.transactionStatus}
      onChange={handleFilterStatus}
      sx={{
        px: 2.5,
        boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
      }}
    >
      {options.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={(tab.value === 'all' && 'filled') || 'soft'}
              color={
                (tab.value === 'Wait requisites' && 'secondary') ||
                (tab.value === 'Process' && 'warning') ||
                (tab.value === 'Marked as paid' && 'info') ||
                (tab.value === 'Canceled' && 'error') ||
                (tab.value === 'Support' && 'info') ||
                (tab.value === 'Success' && 'success') ||
                'default'
              }
            >
              {renderCount(tab.value)}
            </Label>
          }
        />
      ))}
    </Tabs>
  );
};

export default P2PTableTabs;
