import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { getNoun } from 'src/utils/getNoun';
import { fDate, fTimestamp } from 'src/utils/format-time';
import { fPercent, fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';

import getLabel from './get-label';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellInvestors({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" height="100%">
      {params.row.pampInvestors}
    </Stack>
  );
}

export function RenderCellСompanyType({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" height="100%">
      {getLabel(params.row.companytype)}
    </Stack>
  );
}

export function RenderCellPrice({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" height="100%">
      {fCurrency(params.row[params.field])}
    </Stack>
  );
}

export function RenderCellDecent({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" height="100%">
      {params.row.percents}%
    </Stack>
  );
}

export function RenderCellRanges({ params }: ParamsProps) {
  const range = params.row.ranges;
  return (
    <Stack direction="row" alignItems="center" height="100%">
      {fTimestamp(range)} {getNoun(range, 'Месяц', 'Месяца', 'Месяцев', 'Истек')}
    </Stack>
  );
}

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" height="100%">
      <Label variant="soft" color={(params.row.publish === 'published' && 'info') || 'default'}>
        {params.row.briefcaseStatus}
      </Label>
    </Stack>
  );
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" height="100%">
      <ListItemText
        primary={fDate(params.row[params.field])}
        lang="ru"
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      />
    </Stack>
  );
}

export function RenderCellProgress({ params }: ParamsProps) {
  return (
    <Stack
      sx={{ typography: 'caption', color: 'text.secondary' }}
      height="100%"
      justifyContent="center"
    >
      <LinearProgress
        value={(params.row.pamAmount / params.row.amountFinish) * 100}
        variant="determinate"
        color={
          (params.row.inventoryType === 'out of stock' && 'error') ||
          (params.row.inventoryType === 'low stock' && 'warning') ||
          'success'
        }
        sx={{ mb: 1, height: 6, width: 80 }}
      />
      {fPercent((params.row.pamAmount / params.row.amountFinish) * 100)}
    </Stack>
  );
}

export function RenderCellProduct({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.briefcaseName}
        src={params.row.logo}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={params.row.briefcaseId}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.briefcaseName}
          </Link>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
