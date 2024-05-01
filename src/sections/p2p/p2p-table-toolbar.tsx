// import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
// import { SelectChangeEvent } from '@mui/material/Select';

import { IP2PTableFilters } from 'src/types/transaction';

// ----------------------------------------------------------------------

type Props = {
  filters: IP2PTableFilters;
  onFilters: (name: string, value: string) => void;
};

// const roleOptions: string[] = [''];

export default function P2pTableToolbar({ filters, onFilters }: Props) {
  // const handleFilterSearch = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     onFilters('email', event.target.value);
  //   },
  //   [onFilters]
  // );
  //
  // const handleFilterRole = useCallback(
  //   (event: SelectChangeEvent<string>) => {
  //     onFilters('role', event.target.value);
  //   },
  //   [onFilters]
  // );

  // @ts-ignore
  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      {/* <FormControl */}
      {/*  sx={{ */}
      {/*    flexShrink: 0, */}
      {/*    width: { xs: 1, md: 200 }, */}
      {/*  }} */}
      {/* > */}
      {/*  <InputLabel>Роль</InputLabel> */}

      {/*  <Select */}
      {/*    // @ts-ignore */}
      {/*    value={filters.role} */}
      {/*    onChange={handleFilterRole} */}
      {/*    input={<OutlinedInput label="Role" />} */}
      {/*    renderValue={(selected) => selected} */}
      {/*    MenuProps={{ */}
      {/*      PaperProps: { */}
      {/*        sx: { maxHeight: 240 }, */}
      {/*      }, */}
      {/*    }} */}
      {/*  > */}
      {/*    {roleOptions.map((option) => ( */}
      {/*      <MenuItem key={option} value={option}> */}
      {/*        <Checkbox */}
      {/*          disableRipple */}
      {/*          size="small" */}
      {/*          checked={filters.transactionStatus.includes(option)} */}
      {/*        /> */}
      {/*        {option} */}
      {/*      </MenuItem> */}
      {/*    ))} */}
      {/*  </Select> */}
      {/* </FormControl> */}

      {/* <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}> */}
      {/*  <TextField */}
      {/*    fullWidth */}
      {/*    value={filters.email} */}
      {/*    onChange={handleFilterSearch} */}
      {/*    placeholder="Поиск по e-mail" */}
      {/*    InputProps={{ */}
      {/*      startAdornment: ( */}
      {/*        <InputAdornment position="start"> */}
      {/*          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} /> */}
      {/*        </InputAdornment> */}
      {/*      ), */}
      {/*    }} */}
      {/*  /> */}
      {/* </Stack> */}
    </Stack>
  );
}
