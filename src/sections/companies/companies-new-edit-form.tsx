import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
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
import { ExtendCompany } from '../../types/company';
import { CompaniesNewEditFormDate } from './companies-new-edit-form-date';
import { CompaniesNewEditFormDetail } from './companies-new-edit-form-detail';
import {
  createCompany,
  updateCompany,
  deleteCompanyFile,
  addEditCompanyFile,
} from '../../api/company';

// ----------------------------------------------------------------------

interface FormState extends ExtendCompany {
  images: any;
}

type Prop = { currentCompany?: ExtendCompany; id?: string; companyId?: string; lang: string };

export default function CompaniesNewEditForm({ currentCompany, companyId, id, lang }: Prop) {
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

  // @ts-ignore
  const defaultValues = useMemo(
    () => ({
      companyType: currentCompany?.companyType || 'Company',
      briefcaseName: currentCompany?.briefcaseName || '',
      descriptions: currentCompany?.descriptions || '',
      briefcaseStatus: currentCompany?.briefcaseStatus || '',
      amountFinish: currentCompany?.amountFinish || '',
      amountMin: currentCompany?.amountMin || '',
      ranges: currentCompany?.ranges || '',
      percents: currentCompany?.percents || '',
      lang,
      // @ts-ignore
      images: currentCompany?.images || [],
      logo: currentCompany?.logo || '',
      image: currentCompany?.image || '',
      finishDay: currentCompany?.finishDay ? new Date(currentCompany.finishDay) : '',
      pampInvestors: currentCompany?.pampInvestors || 0,
      pampAmount: currentCompany?.pampAmount || 0,
      companyInvestDetailInputs: currentCompany?.companyInvestDetailDtoList || [
        {
          id: '',
          companyInvestDetailTypeId: '',
          companyInvestDetailTypeDescriptions: '',
          descriptions: '',
        },
      ],
    }),
    // @ts-ignore
    [currentCompany?.amountFinish, currentCompany?.amountMin, currentCompany?.briefcaseName, currentCompany?.briefcaseStatus, currentCompany?.companyInvestDetailDtoList, currentCompany?.companyType, currentCompany?.descriptions, currentCompany.finishDay, currentCompany?.image, currentCompany?.images, currentCompany?.logo, currentCompany?.pampAmount, currentCompany?.pampInvestors, currentCompany?.percents, currentCompany?.ranges, lang]
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
      if (currentCompany) {
        await updateCompany(data, currentCompany.briefcaseId, currentCompany.companyInvestId);
        router.push(paths.dashboard.companies.root);
      } else {
        await createCompany(data).then(({ briefcaseId, companyInvestId }) =>
          router.push(
            `${paths.dashboard.companies.edit(briefcaseId)}?companyId=${companyInvestId}&lang=ru`
          )
        );
      }
      reset();
      enqueueSnackbar(currentCompany ? 'Update success!' : 'Create success!');
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (currentCompany) {
        acceptedFiles.map((file) => addEditCompanyFile(file, currentCompany.companyInvestId));
      }

      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      await setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [currentCompany, setValue, values.images]
  );

  const handleDropSingleFile = useCallback(
    async (acceptedFiles: File[], name: 'logo' | 'image') => {
      const file = await toBase64(acceptedFiles[0]);

      if (file) {
        setValue(name, file, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(
    async (inputFile: File | string) => {
      if (currentCompany) {
        // @ts-ignore
        const filtered = values.images?.filter((file) => file.id !== inputFile.id);
        // @ts-ignore
        await deleteCompanyFile(inputFile.id);
        await setValue('images', filtered);
      } else {
        // @ts-ignore
        const filtered = values.images && values.images?.filter((file) => file !== inputFile);
        setValue('images', filtered);
      }
    },
    [currentCompany, setValue, values.images]
  );

  const handleEditRow = useCallback(
    (currentId?: string, companyCurrentId?: string, currentLang?: string) => {
      reset()
      router.push(
        `${paths.dashboard.companies.edit(
          currentId ?? ''
        )}?companyId=${companyCurrentId}&lang=${currentLang}`
      );
    },
    [reset, router]
  );

  const renderTabs = (
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
        <Stack
          direction="row"
          spacing="40px"
          sx={{
            borderBottom: '2px solid #F6F7F8',
            marginBottom: '58px',
            paddingBottom: '15px',
          }}
        >
          <ButtonStyled
            active={values.lang === 'ru'}
            type="button"
            onClick={() => handleEditRow(id, companyId, 'ru')}
          >
            <img
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAUABwDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+wv8A4eg/8E5P+j5f2Vv/AA+Hw+/+Xtfpf/EGvFr/AKNvxr/4jea//Mx8n/r3wX/0VWQf+HTB/wDy0P8Ah6D/AME5P+j5f2Vv/D4fD7/5e0f8Qa8Wv+jb8a/+I3mv/wAzB/r3wX/0VWQf+HTB/wDy0P8Ah6D/AME5P+j5f2Vv/D4fD7/5e0f8Qa8Wv+jb8a/+I3mv/wAzB/r3wX/0VWQf+HTB/wDy0P8Ah6D/AME5P+j5f2Vv/D4fD7/5e0f8Qa8Wv+jb8a/+I3mv/wAzB/r3wX/0VWQf+HTB/wDy0/zCP+GfvHH/AD9eHv8AwPvf/lZX9O/8VP8A6On/AEJvFP8A8Rrh/wD+i4/X/wDijl9Kz/ooPBj/AMS7ij/6BQ/4Z+8cf8/Xh7/wPvf/AJWUf8VP/o6f9CbxT/8AEa4f/wDouD/ijl9Kz/ooPBj/AMS7ij/6BQ/4Z+8cf8/Xh7/wPvf/AJWUf8VP/o6f9CbxT/8AEa4f/wDouD/ijl9Kz/ooPBj/AMS7ij/6BQ/4Z+8cf8/Xh7/wPvf/AJWUf8VP/o6f9CbxT/8AEa4f/wDouD/ijl9Kz/ooPBj/AMS7ij/6BT+sn/h1Z+z3/wBDj8Zf/Ch8Ef8AzvK/xr/4htkX/QXm3/g/B/8AzAf64/8AE2niN/0JeCf/AA3Z7/8ARIH/AA6s/Z7/AOhx+Mv/AIUPgj/53lH/ABDbIv8AoLzb/wAH4P8A+YA/4m08Rv8AoS8E/wDhuz3/AOiQP+HVn7Pf/Q4/GX/wofBH/wA7yj/iG2Rf9Bebf+D8H/8AMAf8TaeI3/Ql4J/8N2e//RIH/Dqz9nv/AKHH4y/+FD4I/wDneUf8Q2yL/oLzb/wfg/8A5gD/AIm08Rv+hLwT/wCG7Pf/AKJA/9k="
              alt=""
            />
            <span>Русский</span>
          </ButtonStyled>
          {currentCompany && (
            <>
              <ButtonStyled
                active={values.lang === 'en'}
                type="button"
                onClick={() => handleEditRow(id, companyId, 'en')}
              >
                <img
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAQABwDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8eLP9pf8AafmsrZY/2gPF1295BDM73nx6+JgfUxFZ+dFPcLpOriCd7lJrjzP+FcyW9lYWWnT7IG+0jUD/AHdLJckUpf8ACVQiotr3cqwXuXlay9pTuuW0bfXE5SlNa6ch/MyzDMeVf7dVbaT1x2I97S6b5ZWd9b/V7Rik7J35j9lf+Ca/jf4m+Ofhv8RLrx9458ReONQ0vx1aadZX+ra54++JBt7IeF9HuBHaain/AAUe/ZKv9KtrmWZ7uLSNa8C63qsUE0FxceI3Fwmn2X8x+OOFwmGz7J1g8NSwsJ5O5ThSwscNzS+vYpXlGhiMLTnJK0XOMZwbTUZ6OMf9Fvob4idbgfin63VdeUOLGoSq5jgI2i8myzSKzHwI8WKqTav7uc5buubK07YvE/pDt1H+/d/+Et8R/wD6ePX4lb+rVP8A54n9f3w/8tL/AMOXD/8A9RoG3Uf793/4S3xH/wDp49Fv6tU/+eIXw/8ALS/8OXD/AP8AUaFFrDcEDaWrBEaJA2vfEIhI3jSJ40z/AMENPlR4o44mQYVo0RCCqqB6v9u55/0Oc11d/wDkY47dNtP/AHPdNt+rbPjP+IbeGn/RC8Edv+SE4D2/8a88l9xPDDcW5lNvZyQGeVp5zD4j+IsRmmfl5pSn/BDZTJK55aR8u3cmuPE4zGYyUJ4zFYnFThBU4SxOIxFeUIJtqEJVcBJxgm21FNK7btqe9lOQcOZDRq4fIspybJcPXq+3rUMp4c4Ty6jWruMYOtVpYP6YtGFSq4QhD2k4ufLGMb2ikpt+o/8APO7/APCo+JP/ANI4rm1/pz/+dx6vLh/5qf8A4beHv/qyg36j/wA87v8A8Kj4k/8A0jijX+nP/wCdwcuH/mp/+G3h7/6soP/Z"
                  alt=""
                />
                <span>English</span>
              </ButtonStyled>
              <ButtonStyled
                active={values.lang === 'de'}
                type="button"
                onClick={() => handleEditRow(id, companyId, 'de')}
              >
                <img
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAASABwDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+RL/hY/8AwVB/6L3+1f8A+JHeOf8A54Nfn3/EVfD/AP6KTDf+EuYf/MZ/YX/Egn0vf+jKZ5/4fODv/ojD/hY//BUH/ovf7V//AIkd45/+eDR/xFXw/wD+ikw3/hLmH/zGH/Egn0vf+jKZ5/4fODv/AKIw/wCFj/8ABUH/AKL3+1f/AOJHeOf/AJ4NH/EVfD//AKKTDf8AhLmH/wAxh/xIJ9L3/oymef8Ah84O/wDojD/hY/8AwVB/6L3+1f8A+JHeOf8A54NH/EVfD/8A6KTDf+EuYf8AzGH/ABIJ9L3/AKMpnn/h84O/+iM/sr/4cW+FP+jjfEP/AIbbTf8A5sa/52/+Kg+cf9Gvyz/xKcV/84z/AGL/AOJ9s3/6Nrlv/iTYr/5zB/w4t8Kf9HG+If8Aw22m/wDzY0f8VB84/wCjX5Z/4lOK/wDnGH/E+2b/APRtct/8SbFf/OYP+HFvhT/o43xD/wCG203/AObGj/ioPnH/AEa/LP8AxKcV/wDOMP8AifbN/wDo2uW/+JNiv/nMH/Di3wp/0cb4h/8ADbab/wDNjR/xUHzj/o1+Wf8AiU4r/wCcYf8AE+2b/wDRtct/8SbFf/OY/rl/4Q3wh/0Kvhv/AMEemf8AyLX9pf8AEH/CT/o1vhz/AOIRwz/87D/Er/WPiH/ofZz/AOHTHf8Ay8P+EN8If9Cr4b/8Eemf/ItH/EH/AAk/6Nb4c/8AiEcM/wDzsD/WPiH/AKH2c/8Ah0x3/wAvD/hDfCH/AEKvhv8A8Eemf/ItH/EH/CT/AKNb4c/+IRwz/wDOwP8AWPiH/ofZz/4dMd/8vD/hDfCH/Qq+G/8AwR6Z/wDItH/EH/CT/o1vhz/4hHDP/wA7A/1j4h/6H2c/+HTHf/Lw/9k="
                  alt=""
                />
                <span>Deutsch</span>
              </ButtonStyled>
            </>
          )}
        </Stack>
      </Grid>
    </>
  );

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
              name="pampAmount"
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
                onDrop={(file) => handleDropSingleFile(file, 'logo')}
                onDelete={() => setValue('logo', '', { shouldValidate: true })}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderImage = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Обложка
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Загрузите обложку
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Обложка" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Обложка</Typography>
              <RHFUpload
                name="image"
                maxSize={3145728}
                onDrop={(file) => handleDropSingleFile(file, 'image')}
                onDelete={() => setValue('image', '', { shouldValidate: true })}
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
          {currentCompany ? 'Обновить' : 'Опубликовать'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderTabs}

        {renderDetails}

        {renderPump}

        {renderDescriptions}

        {renderLogo}

        {renderImage}

        {renderFiles}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

const ButtonStyled = styled('button')<{ active: boolean }>`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  color: #637381;
  cursor: pointer;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    left: 0;
    bottom: -17px;
    height: 2px;
    background: #212b36;
    opacity: 0;
    transition: opacity 400ms ease;
  }

  span {
    margin-left: 8px;
  }

  ${({ active }) =>
    active &&
    `
      &::before {
        opacity: 1;
      }
  `}
`;
