import { useFieldArray, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import Iconify from '../../components/iconify';
import { useGetCompaniesDetailList } from '../../api/company';
import { RHFTextField, RHFAutocomplete } from '../../components/hook-form';

export const CompaniesNewEditFormDetail = () => {
  const { control, setValue } = useFormContext();

  const { detailList, detailLoading } = useGetCompaniesDetailList();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'companyInvestDetailInputs',
  });

  const handleAdd = () => {
    append({
      id: '',
      companyInvestDetailTypeId: '',
      companyInvestDetailTypeDescriptions: '',
      descriptions: '',
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <>
      {fields.map((value, index) => (
        <>
          <Stack spacing={3} sx={{ p: 3 }} key={index}>
            <RHFAutocomplete
              freeSolo
              name={`companyInvestDetailInputs[${index}].companyInvestDetailTypeDescriptions`}
              label="Заголовок"
              placeholder="+Заголовок *"
              options={detailList.map((option) => option.descriptions)}
              // @ts-ignore
              getOptionLabel={(option) => option}
              loading={detailLoading}
              onBlur={(e) => {
                // @ts-ignore
                const findItem = detailList.find((item) => item.descriptions === e.target.value);
                if (!findItem) {
                  setValue(
                    `companyInvestDetailInputs[${index}].companyInvestDetailTypeDescriptions`,
                    // @ts-ignore
                    e.target.value
                  );
                  setValue(`companyInvestDetailInputs[${index}].companyInvestDetailTypeId`, '');
                } else {
                  setValue(
                    `companyInvestDetailInputs[${index}].companyInvestDetailTypeId`,
                    findItem.id
                  );
                }
              }}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
            />

            <RHFTextField
              name={`companyInvestDetailInputs[${index}].descriptions`}
              label="Краткое описание *"
              multiline
              rows={4}
            />
          </Stack>

          <Stack spacing={3} sx={{ p: 3 }} alignItems="flex-end">
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => handleRemove(index)}
            >
              Удалить
            </Button>
          </Stack>

          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
        </>
      ))}
      <Stack spacing={3} sx={{ p: 3 }}>
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Добавить описание
        </Button>
      </Stack>
    </>
  );
};
