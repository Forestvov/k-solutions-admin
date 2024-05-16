import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { toBase64 } from 'src/utils/toBase64';

import { saveTokens, useGetTokens } from 'src/api/settings';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFUpload, RHFTextField } from 'src/components/hook-form';

import { SettingToken } from 'src/types/settings';

const BodyApi = () => {
  const { tokens, tokensLoading, mutate } = useGetTokens();

  const NewBlogSchema = Yup.object().shape({
    data: Yup.array().of(
      Yup.object().shape({
        currentName: Yup.string().required('Платежная система обязательна'),
        value: Yup.string().required('Адрес кошелька обязателен'),
        transactionLinkType: Yup.string().required('Тип обязателен'),
        image: Yup.string(),
        qrCode: Yup.string(),
        currencyTypeId: Yup.string(),
        staticCurse: Yup.string(),
      })
    ),
  });

  const defaultValues = useMemo<{ data: SettingToken[] }>(
    () => ({
      data: tokens.map((token) => ({
        ...token,
        staticCurse: token.staticCurse ?? 1,
      })),
    }),
    [tokens]
  );

  const methods = useForm({
    // @ts-ignore
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (tokens) {
      setValue(
        'data',
        tokens.map((token) => ({
          ...token,
          staticCurse: token.staticCurse ?? 1,
        }))
      );
    }
  }, [setValue, tokens]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await saveTokens(data.data);
      await mutate()
    } catch (error) {
      console.error(error);
    }
  });

  const handleDropSingleFile = useCallback(
    async (acceptedFiles: File[], name: string) => {
      const file = await toBase64(acceptedFiles[0]);

      if (file) {
        // @ts-ignore
        setValue(name, file, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const { fields, append } = useFieldArray({
    control,
    name: 'data',
  });

  const handleAdd = () => {
    append({
      currencyTypeId: '',
      currentName: '',
      value: '',
      transactionLinkType: 'Visa',
      staticCurse: '1',
      image: '',
      qrCode: '',
    });
  };

  if (tokensLoading) {
    return <div />;
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5}>
        {fields.map((item, idx) => (
          <Card key={idx} sx={{ maxWidth: '855px' }}>
            <Stack spacing={3} sx={{ p: 3 }}>
              <RHFTextField name={`data[${idx}].currentName`} label="Платежная система " />
              <RHFTextField name={`data[${idx}].value`} label="Адрес кошелька " />
              <RHFSelect name={`data[${idx}].transactionLinkType`} label="Выбирети тип ">
                <MenuItem key="Visa" value="Visa">
                  Visa
                </MenuItem>
                <MenuItem key="Token" value="Token">
                  Token
                </MenuItem>
                <MenuItem key="p2p" value="p2p">
                  p2p
                </MenuItem>
                <MenuItem key="Bank" value="Bank">
                  Bank
                </MenuItem>
                <MenuItem key="Wallet" value="Wallet">
                  Wallet
                </MenuItem>
              </RHFSelect>
              <RHFTextField name={`data[${idx}].staticCurse`} label="Статичный курс" />
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Логотип</Typography>
                <RHFUpload
                  name={`data[${idx}].image`}
                  maxSize={3145728}
                  onDrop={(file) => handleDropSingleFile(file, `data[${idx}].image`)}
                  // @ts-ignore
                  onDelete={() => setValue(`data[${idx}].image`, '', { shouldValidate: true })}
                />
              </Stack>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Qrcode</Typography>
                <RHFUpload
                  name={`data[${idx}].qrCode`}
                  maxSize={3145728}
                  onDrop={(file) => handleDropSingleFile(file, `data[${idx}].qrCode`)}
                  // @ts-ignore
                  onDelete={() => setValue(`data[${idx}].qrCode`, '', { shouldValidate: true })}
                />
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
      <Stack
        spacing={3}
        sx={{ p: 5 }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button
          size="large"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Добавить описание
        </Button>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          Обновить
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
};

export default BodyApi;
