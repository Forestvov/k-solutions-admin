import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useResponsive } from 'src/hooks/use-responsive';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFUpload, RHFTextField } from 'src/components/hook-form';

import { paths } from '../../routes/paths';
import { errorCatcher } from './errorCatcher';
import { useRouter } from '../../routes/hooks';
import { toBase64 } from '../../utils/toBase64';
import { createCompany } from '../../api/company';
import { ExtendCompany } from '../../types/company';
import { CompaniesNewEditFormDate } from './companies-new-edit-form-date';
import { CompaniesNewEditFormDetail } from './companies-new-edit-form-detail';

// ----------------------------------------------------------------------

type Prop = { currentCompany?: ExtendCompany };

interface FormState extends ExtendCompany {
  images: File[];
}

export default function CompaniesNewEditForm({ currentCompany }: Prop) {
  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const compnayShema = Yup.object().shape({
    briefcaseName: Yup.string().required('Введите имя компании'),
    descriptions: Yup.string().required('Введите описание'),
    amountFinish: Yup.number().required('Введите цель сбора'),
    amountMin: Yup.number().required('Введите минимальную сумму'),
    percents: Yup.number().required('Введите ставку'),
    finishDay: Yup.string().required('Введите дату'),
    ranges: Yup.number().required('Введите срок'),
  });

  const franchiseShema = Yup.object().shape({
    briefcaseName: Yup.string().required('Name is required'),
    descriptions: Yup.string().required('Name is required'),
    percents: Yup.number().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      companyType: currentCompany?.briefcaseName || 'Company',
      briefcaseName: currentCompany?.briefcaseName || '',
      descriptions: currentCompany?.descriptions || '',
      briefcaseStatus: currentCompany?.briefcaseStatus || '',
      amountFinish: currentCompany?.amountFinish || '',
      amountMin: currentCompany?.amountMin || '',
      ranges: currentCompany?.ranges || '',
      percents: currentCompany?.percents || '',
      images: [],
      logo: currentCompany?.logo || '',
      finishDay: currentCompany?.finishDay || '',
      pampInvestors: currentCompany?.pampInvestors || '',
      pamAmount: currentCompany?.pamAmount || '',
      companyInvestDetailInputs: currentCompany?.companyInvestDetailInputs || [
        {
          id: '',
          companyInvestDetailTypeId: '',
          companyInvestDetailTypeDescriptions: '',
          descriptions: '',
        },
      ],
    }),
    [currentCompany]
  );

  const methods = useForm<FormState>({
    // @ts-ignore
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const router = useRouter();

  useEffect(() => {
    if (currentCompany) {
      // @ts-ignore
      reset(defaultValues);
    }
  }, [currentCompany, defaultValues, reset]);

  useEffect(() => {
    if (values.companyType === 'Franchise') {
      setValue('amountFinish', '');
      setValue('finishDay', '');
      setValue('ranges', 0);
    }
  }, [values.companyType, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (methods.getValues('companyType') === 'Company') {
        await compnayShema.validate(data, { abortEarly: false });
      } else {
        await franchiseShema.validate(data, { abortEarly: false });
      }
    } catch (error) {
      errorCatcher(error, methods.setError);
      return;
    }

    try {
      await createCompany(data);
      reset();
      enqueueSnackbar(currentCompany ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.companies.root);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleDropSingleFile = useCallback(
    async (acceptedFiles: File[]) => {
      const file = await toBase64(acceptedFiles[0]);

      if (file) {
        setValue('logo', file, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Основная информация
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Введите основную информацию
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Основная информация" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFSelect name="companyType" label="Выбирети тип *">
              <MenuItem key="Company" value="Company">
                Компания
              </MenuItem>
              <MenuItem key="Franchise" value="Franchise">
                Франшиза
              </MenuItem>
            </RHFSelect>

            <RHFTextField name="briefcaseName" label="Название компании *" />

            <RHFTextField name="descriptions" label="Краткое описание *" multiline rows={4} />

            {values.companyType === 'Company' && (
              <>
                <RHFTextField
                  name="amountFinish"
                  label="Цель сбора ($) *"
                  placeholder="0"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                />
                <RHFTextField
                  name="amountMin"
                  label="Минимальная сумма ($) *"
                  placeholder="0"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                />
              </>
            )}

            <RHFTextField
              name="percents"
              label="Ставка, % ежемясчный *"
              placeholder="0"
              type="number"
              InputLabelProps={{ shrink: true }}
            />

            {values.companyType === 'Company' && (
              <>
                <CompaniesNewEditFormDate label="Дата окончания сбора *" name="finishDay" />

                <RHFTextField
                  name="ranges"
                  label="Срок займа (мес.) *"
                  placeholder="0"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                />
              </>
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPump = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Памп компании
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Если нужно запампить компаню, введите данные
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Памп компании" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="pamAmount"
              label="Собрано ($)"
              placeholder="0"
              type="number"
              InputLabelProps={{ shrink: true }}
            />
            <RHFTextField
              name="pampInvestors"
              label="Кол-во инвесторов"
              placeholder="0"
              type="number"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderDescriptions = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Блоки с опсисаниями
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Введите контент на всех языках
          </Typography>
        </Grid>
      )}
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Блоки с опсисаниями" />}

          <CompaniesNewEditFormDetail />
        </Card>
      </Grid>
    </>
  );

  const renderLogo = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Логотип
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Загрузите логотип
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Логотип" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Логотип</Typography>
              <RHFUpload
                name="logo"
                maxSize={3145728}
                onDrop={handleDropSingleFile}
                onDelete={() => setValue('logo', '', { shouldValidate: true })}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderFiles = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Медиафайлы компании
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Загрузите медиафайлы компании
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Медиафайлы компании" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="subtitle2">Медиафайлы</Typography>
            <RHFUpload
              multiple
              thumbnail
              name="images"
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onUpload={() => console.info('ON UPLOAD')}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', marginTop: '40px' }}>
        <Box sx={{ flexGrow: 1, pl: 3 }} />

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          Опубликовать
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderPump}

        {renderDescriptions}

        {renderLogo}

        {renderFiles}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
