import { useForm } from 'react-hook-form';
import { useMemo, useEffect, useContext } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useGetTokens } from 'src/api/settings';

import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import CountdownTimer from './p2p-timer';
import { paths } from '../../routes/paths';
import { fixTime } from '../../utils/fix-time';
import { useRouter } from '../../routes/hooks';
import { TimerContext } from '../../timer/context';
import { fDateTime } from '../../utils/format-time';
import axios, { endpoints } from '../../utils/axios';
import { useResponsive } from '../../hooks/use-responsive';

type Props = {
  current?: any;
  update: VoidFunction;
};

const P2PEditForm = ({ current, update }: Props) => {
  const mdUp = useResponsive('up', 'md');

  const defaultValues = useMemo(
    () => ({
      transactionId: current?.transactionId || '',
      accountId: current?.accountId || '',
      accountTypeName: current?.accountTypeName || '',
      transactionType: current?.transactionType || '',
      fio: current?.fio || '',
      username: current?.username || '',
      email: current?.email || '',
      transactionStatus: current?.transactionStatus || '',
      currentName: current?.currentName || '',
      amount: current?.amount || '',
      amountIn: current?.amountIn || '',
      amountOut: current?.amountOut || '',
      contactFrom: current?.contactFrom || '',
      cartName: current?.cartName || '',
      cartNumber: current?.cartNumber,
      cartCVV: current?.cartCVV,
      cartDate: current?.cartDate,
      transactionDate: current?.transactionDate
        ? `${fDateTime(fixTime(current?.transactionDate))}`
        : '',
      transactionDateOld: current?.transactionDate || '',
      cardNumber: current?.contactNumber || '',
      cardName: current?.contactName || '',
      typePay: current?.typePay || '',
      image: current?.image || '',
      qrCode: current?.qrCode || '',
      transactionLinkType: current?.transactionLinkType || '',
    }),
    [current]
  );

  const router = useRouter();

  const { tokens } = useGetTokens();

  const { wait_requisites, wait_process } = useContext(TimerContext);

  useEffect(() => {
    if (current && current.transactionStatus === 'Wait requisites' && wait_requisites) {
      const elMinutes1 = document.querySelector(`.minutes`);
      const elSeconds1 = document.querySelector(`.seconds`);
      const progress = document.querySelector('.progress');

      if (!progress || !elMinutes1 || !elSeconds1) {
        return;
      }

      const deadline1 = new Date(current.transactionDate);
      deadline1.setMinutes(deadline1.getMinutes() + wait_requisites);
      // @ts-ignore
      progress.style.width = '100%';

      // eslint-disable-next-line no-new
      new CountdownTimer(
        deadline1,
        (timer: {
          minutes: string | null;
          seconds: string | null;
          minutesTitle: any;
          secondsTitle: any;
        }) => {
          elMinutes1.textContent = timer.minutes;
          elSeconds1.textContent = timer.seconds;
          // eslint-disable-next-line eqeqeq
          // @ts-ignore
          progress.style.width = `${((timer.minutes * 60) / 1200) * 100}%`;
          // eslint-disable-next-line eqeqeq
          // @ts-ignore
          elMinutes1.dataset.title = timer.minutesTitle;
          // @ts-ignore
          elSeconds1.dataset.title = timer.secondsTitle;
        },
        () => {}
      );
    }

    if (current && current.transactionStatus === 'Process' && wait_process) {
      const elMinutes1 = document.querySelector(`.minutes`);
      const elSeconds1 = document.querySelector(`.seconds`);
      const progress = document.querySelector('.progress');

      if (!progress || !elMinutes1 || !elSeconds1) {
        return;
      }

      const deadline1 = new Date(current.transactionDate);
      deadline1.setMinutes(deadline1.getMinutes() + wait_process);
      // @ts-ignore
      progress.style.width = '100%';

      // eslint-disable-next-line no-new
      new CountdownTimer(
        deadline1,
        (timer: {
          minutes: string | null;
          seconds: string | null;
          minutesTitle: any;
          secondsTitle: any;
        }) => {
          elMinutes1.textContent = timer.minutes;
          elSeconds1.textContent = timer.seconds;
          // eslint-disable-next-line eqeqeq
          // @ts-ignore
          progress.style.width = `${((timer.minutes * 60) / 1200) * 100}%`;
          // eslint-disable-next-line eqeqeq
          // @ts-ignore
          elMinutes1.dataset.title = timer.minutesTitle;
          // @ts-ignore
          elSeconds1.dataset.title = timer.secondsTitle;
        },
        () => {}
      );
    }
  }, [current, wait_process, wait_requisites]);

  const methods = useForm({
    mode: 'onChange',
    // resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (current) {
      // @ts-ignore
      reset(defaultValues);
    }
  }, [current, defaultValues, reset]);

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (current) {
        const formData = {
          transactionId: current.transactionId,
          accountId: current.accountId,
          email: data.email,
          accountTypeName: current.accountTypeName,
          transactionType: current.transactionType,
          transactionStatus: data.transactionStatus,
          transactionDate: current.transactionDate,
          currentName: data.currentName,
          typePay: current.typePay,
          amountIn: +data.amountIn,
          amountOut: +data.amountOut,
          fio: data.fio,
          username: data.username,
          image: current.image,
          contact: `${data.cardNumber}:${data.cardName}`,
          contactFrom: `${data.cartName}:${data.cartDate}:${data.cartNumber}:${data.cartCVV}`,
          qrCode: current.qrCode,
          transactionLinkType: current.transactionLinkType,
        };
        await axios.put(endpoints.transaction.update, formData);
        await router.push(paths.dashboard.p2p.list);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const onSubmitRequisites = async () => {
    await axios.put(endpoints.transaction.add_requisites, {
      transactionId: current?.transactionId || 0,
      cardNumber: values.cardNumber,
      cardName: values.cardName,
    });
    await update();
  };

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Информация пользователя
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Вся информация по пользователю
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Информация пользователя" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="fio" label="ФИО *" />
            <RHFTextField name="username" label="Логин *" />
            <RHFTextField name="email" label="Mail *" />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderInfo = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Информация по оредеру
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '305px' }}>
            Вся информация по ордеру от пользователя
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Выдача реквизитов" />}
          <Stack spacing={3} sx={{ p: 3 }}>
            {current?.transactionStatus === 'Wait requisites' && (
              <Stack spacing={1}>
                <Progress>
                  <Line className="progress" />
                </Progress>
                <Stack direction="row" alignItems="center" spacing="12px">
                  <Box
                    sx={{
                      fontWeight: 500,
                    }}
                  >
                    <span className="minutes" />:<span className="seconds" />
                  </Box>
                  <Box
                    sx={{
                      color: '#616161',
                      fontSize: '14px',
                    }}
                  >
                    Осталось времени для выдачи реквизитов
                  </Box>
                </Stack>
              </Stack>
            )}
            <RHFTextField name="transactionDate" label="Дата заявки ордера *" disabled />
            <RHFSelect name="transactionStatus" label="Статус">
              <MenuItem key="Wait requisites" value="Wait requisites">
                Ожидание реквизитов
              </MenuItem>
              <MenuItem key="Process" value="Process">
                В процессе оплаты
              </MenuItem>
              <MenuItem key="Marked as paid" value="Marked as paid">
                Отмеченно как оплаченно
              </MenuItem>
              <MenuItem key="Support" value="Support">
                Обратитесь в поддержку по вашей заявке с контакт менеджером
              </MenuItem>
              <MenuItem key="Canceled" value="Canceled">
                Отклоненно
              </MenuItem>
              <MenuItem key="Hidden" value="Hidden">
                Скрытый
              </MenuItem>
              <MenuItem key="Success" value="Success">
                Выполненно
              </MenuItem>
            </RHFSelect>
            <RHFSelect name="currentName" label="Банк *">
              {tokens.map((token) => (
                <MenuItem key={token.currentName} value={token.currentName}>
                  {token.currentName}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField name="cartNumber" label="Номер карты ЮЗЕРА *" />
            <RHFTextField name="cartName" label="Имя владельца карты ЮЗЕРА *" />
            {current.transactionType === 'In' ? (
              <>
                <RHFTextField
                  name="amountIn"
                  label="Сумма отправки ₽ *"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          ₽
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
                <RHFTextField
                  name="amountOut"
                  label="Сумма получения $ *"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          $
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            ) : (
              <RHFTextField
                name="amountOut"
                label="Сумма вывода ₽ *"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        ₽
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderRequest = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Выдача реквизитов
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '305px' }}>
            Введите реквизиты, которые будут переданны пользователю для оплаты
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Выдача реквизитов" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {current?.transactionStatus === 'Process' && (
              <Stack spacing={1}>
                <Progress>
                  <Line className="progress" />
                </Progress>
                <Stack direction="row" alignItems="center" spacing="12px">
                  <Box
                    sx={{
                      fontWeight: 500,
                    }}
                  >
                    <span className="minutes" />:<span className="seconds" />
                  </Box>
                  <Box
                    sx={{
                      color: '#616161',
                      fontSize: '14px',
                    }}
                  >
                    Осталось времени для оплаты пользователем
                  </Box>
                </Stack>
              </Stack>
            )}

            <RHFTextField
              name="cardNumber"
              label="Введите номер карты"
              disabled={current?.transactionStatus !== 'Wait requisites'}
            />

            <RHFTextField
              name="cardName"
              label="Введите имя владельца карты"
              disabled={current?.transactionStatus !== 'Wait requisites'}
            />

            {current?.transactionStatus === 'Wait requisites' && (
              <LoadingButton
                onClick={onSubmitRequisites}
                type="button"
                variant="contained"
                sx={{
                  width: '200px',
                }}
                size="large"
                loading={isSubmitting}
              >
                Отправить реквизиты
              </LoadingButton>
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderButton = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8}>
        <Stack spacing={3} sx={{ p: 3 }} alignItems="flex-end">
          <LoadingButton
            type="submit"
            variant="contained"
            sx={{
              width: '200px',
            }}
            size="large"
            loading={isSubmitting}
          >
            Обновить
          </LoadingButton>
        </Stack>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderInfo}

        {current.transactionType === 'In' ? renderRequest : null}

        {renderButton}
      </Grid>
    </FormProvider>
  );
};

const Progress = styled('div')`
  background: #d9d9d9;
  width: 100%;
  border-radius: 13px;
  height: 6px;
  overflow: hidden;
`;

const Line = styled('div')`
  height: 100%;
  border-radius: 13px;
  background: #006838;
  transition: width 250ms linear;
`;

export default P2PEditForm;
