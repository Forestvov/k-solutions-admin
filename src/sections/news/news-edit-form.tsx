import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { toBase64 } from 'src/utils/toBase64';

import { createNews, updateNews } from 'src/api/news';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFUpload, RHFSelect, RHFTextField } from 'src/components/hook-form';

import { INewPost } from 'src/types/news';

import { CompaniesNewEditFormDate } from '../companies/companies-new-edit-form-date';

type Props = {
  currentPost?: INewPost;
};

const NewsEditForm = ({ currentPost }: Props) => {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Загаловк обязателен'),
    descriptions: Yup.string().required('Описание обязательно'),
    newsType: Yup.string().required('Тип события обязателен'),
    createdDate: Yup.string().required('Дата события обязательна'),
    photo: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentPost?.id || '',
      title: currentPost?.title || '',
      lang: currentPost?.lang || 'ru',
      descriptions: currentPost?.descriptions || '',
      newsType: currentPost?.newsType || '',
      createdDate: currentPost?.createdDate ? new Date(currentPost?.createdDate) : '',
      photo: currentPost?.photo || '',
    }),
    [currentPost]
  );

  const methods = useForm({
    // @ts-ignore
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const newData = {
        ...data,
        createdDate: new Date(data.createdDate).toLocaleString(),
      };

      if (currentPost) {
        await updateNews(newData);
      } else {
        await createNews(newData);
      }

      reset();
      enqueueSnackbar(currentPost ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.news.root);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDropSingleFile = useCallback(
    async (acceptedFiles: File[]) => {
      const file = await toBase64(acceptedFiles[0]);

      if (file) {
        setValue('photo', file, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Блоки с опсисаниями
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Введите контент на выбранном языке
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFSelect name="lang" label="Выбирети тип *">
              <MenuItem key="ru" value="ru">
                Русский
              </MenuItem>
              <MenuItem key="eng" value="eng">
                Английский
              </MenuItem>
              <MenuItem key="de" value="de">
                Немецкий
              </MenuItem>
            </RHFSelect>

            <RHFTextField name="title" label="Заголовок события " />

            <CompaniesNewEditFormDate label="Дата события" name="createdDate" />

            <RHFTextField name="newsType" label="Категория события " />

            <RHFTextField name="descriptions" label="Описание события" multiline rows={3} />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Медиафайл события
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Загрузите медиафайл события
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Медиафайл события" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Медиафайл</Typography>
              <RHFUpload
                name="photo"
                maxSize={3145728}
                onDrop={handleDropSingleFile}
                onDelete={() => setValue('photo', '', { shouldValidate: true })}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}
      >
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentPost ? 'Опубликовать' : 'Обновить'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Grid>
    </FormProvider>
  );
};

export default NewsEditForm;
