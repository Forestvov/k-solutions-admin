import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { NewsList } from '../news-list';
import { useGetNews } from '../../../api/news';
import { NewsFilter } from '../../../types/news';
import { IPagination } from '../../../types/pagination';
import { useSettingsContext } from '../../../components/settings';

const defaultFilters: NewsFilter = {
  lang: 'ru',
  type: '',
};

const NewsListView = () => {
  const settings = useSettingsContext();

  const [filters, setFilters] = useState(defaultFilters);

  const [paginationModel] = useState<IPagination>({
    page: 0,
    pageSize: 60,
  });

  const handleFilters = useCallback((name: string, value: string) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleFilterType = useCallback(
    (event: SelectChangeEvent<string>) => {
      handleFilters('type', event.target.value);
    },
    [handleFilters]
  );

  const { news, newsLoading, mutate } = useGetNews({
    ...paginationModel,
    lang: filters.lang,
    type: filters.type,
  });

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs
        heading="События"
        links={[
          { name: 'Главная', href: paths.dashboard.root },
          {
            name: 'События',
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.news.create}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Создать
          </Button>
        }
        sx={{
          mb: {
            xs: 3,
            md: 5,
          },
        }}
      />
      <Stack
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          marginBottom: '40px',
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Тип</InputLabel>

          <Select
            value={filters.type}
            onChange={handleFilterType}
            input={<OutlinedInput label="Тип" />}
            renderValue={(selected) => (selected === 'News' ? 'Аналитика' : 'Событие')}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            <MenuItem key="News" value="News">
              <Checkbox disableRipple size="small" checked={filters.type.includes('News')} />
              Аналитика
            </MenuItem>
            <MenuItem key="Event" value="Event">
              <Checkbox disableRipple size="small" checked={filters.type.includes('Event')} />
              Событие
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Stack
        direction="row"
        spacing="40px"
        sx={{
          borderBottom: '2px solid #F6F7F8',
          marginBottom: '58px',
          paddingBottom: '15px',
        }}
      >
        <ButtonStyled active={filters.lang === 'ru'} onClick={() => handleFilters('lang', 'ru')}>
          <img
            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAUABwDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+wv8A4eg/8E5P+j5f2Vv/AA+Hw+/+Xtfpf/EGvFr/AKNvxr/4jea//Mx8n/r3wX/0VWQf+HTB/wDy0P8Ah6D/AME5P+j5f2Vv/D4fD7/5e0f8Qa8Wv+jb8a/+I3mv/wAzB/r3wX/0VWQf+HTB/wDy0P8Ah6D/AME5P+j5f2Vv/D4fD7/5e0f8Qa8Wv+jb8a/+I3mv/wAzB/r3wX/0VWQf+HTB/wDy0P8Ah6D/AME5P+j5f2Vv/D4fD7/5e0f8Qa8Wv+jb8a/+I3mv/wAzB/r3wX/0VWQf+HTB/wDy0/zCP+GfvHH/AD9eHv8AwPvf/lZX9O/8VP8A6On/AEJvFP8A8Rrh/wD+i4/X/wDijl9Kz/ooPBj/AMS7ij/6BQ/4Z+8cf8/Xh7/wPvf/AJWUf8VP/o6f9CbxT/8AEa4f/wDouD/ijl9Kz/ooPBj/AMS7ij/6BQ/4Z+8cf8/Xh7/wPvf/AJWUf8VP/o6f9CbxT/8AEa4f/wDouD/ijl9Kz/ooPBj/AMS7ij/6BQ/4Z+8cf8/Xh7/wPvf/AJWUf8VP/o6f9CbxT/8AEa4f/wDouD/ijl9Kz/ooPBj/AMS7ij/6BT+sn/h1Z+z3/wBDj8Zf/Ch8Ef8AzvK/xr/4htkX/QXm3/g/B/8AzAf64/8AE2niN/0JeCf/AA3Z7/8ARIH/AA6s/Z7/AOhx+Mv/AIUPgj/53lH/ABDbIv8AoLzb/wAH4P8A+YA/4m08Rv8AoS8E/wDhuz3/AOiQP+HVn7Pf/Q4/GX/wofBH/wA7yj/iG2Rf9Bebf+D8H/8AMAf8TaeI3/Ql4J/8N2e//RIH/Dqz9nv/AKHH4y/+FD4I/wDneUf8Q2yL/oLzb/wfg/8A5gD/AIm08Rv+hLwT/wCG7Pf/AKJA/9k="
            alt=""
          />
          <span>Русский</span>
        </ButtonStyled>
        <ButtonStyled active={filters.lang === 'eng'} onClick={() => handleFilters('lang', 'eng')}>
          <img
            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAQABwDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8eLP9pf8AafmsrZY/2gPF1295BDM73nx6+JgfUxFZ+dFPcLpOriCd7lJrjzP+FcyW9lYWWnT7IG+0jUD/AHdLJckUpf8ACVQiotr3cqwXuXlay9pTuuW0bfXE5SlNa6ch/MyzDMeVf7dVbaT1x2I97S6b5ZWd9b/V7Rik7J35j9lf+Ca/jf4m+Ofhv8RLrx9458ReONQ0vx1aadZX+ra54++JBt7IeF9HuBHaain/AAUe/ZKv9KtrmWZ7uLSNa8C63qsUE0FxceI3Fwmn2X8x+OOFwmGz7J1g8NSwsJ5O5ThSwscNzS+vYpXlGhiMLTnJK0XOMZwbTUZ6OMf9Fvob4idbgfin63VdeUOLGoSq5jgI2i8myzSKzHwI8WKqTav7uc5buubK07YvE/pDt1H+/d/+Et8R/wD6ePX4lb+rVP8A54n9f3w/8tL/AMOXD/8A9RoG3Uf793/4S3xH/wDp49Fv6tU/+eIXw/8ALS/8OXD/AP8AUaFFrDcEDaWrBEaJA2vfEIhI3jSJ40z/AMENPlR4o44mQYVo0RCCqqB6v9u55/0Oc11d/wDkY47dNtP/AHPdNt+rbPjP+IbeGn/RC8Edv+SE4D2/8a88l9xPDDcW5lNvZyQGeVp5zD4j+IsRmmfl5pSn/BDZTJK55aR8u3cmuPE4zGYyUJ4zFYnFThBU4SxOIxFeUIJtqEJVcBJxgm21FNK7btqe9lOQcOZDRq4fIspybJcPXq+3rUMp4c4Ty6jWruMYOtVpYP6YtGFSq4QhD2k4ufLGMb2ikpt+o/8APO7/APCo+JP/ANI4rm1/pz/+dx6vLh/5qf8A4beHv/qyg36j/wA87v8A8Kj4k/8A0jijX+nP/wCdwcuH/mp/+G3h7/6soP/Z"
            alt=""
          />
          <span>English</span>
        </ButtonStyled>
        <ButtonStyled active={filters.lang === 'de'} onClick={() => handleFilters('lang', 'de')}>
          <img
            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAASABwDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+RL/hY/8AwVB/6L3+1f8A+JHeOf8A54Nfn3/EVfD/AP6KTDf+EuYf/MZ/YX/Egn0vf+jKZ5/4fODv/ojD/hY//BUH/ovf7V//AIkd45/+eDR/xFXw/wD+ikw3/hLmH/zGH/Egn0vf+jKZ5/4fODv/AKIw/wCFj/8ABUH/AKL3+1f/AOJHeOf/AJ4NH/EVfD//AKKTDf8AhLmH/wAxh/xIJ9L3/oymef8Ah84O/wDojD/hY/8AwVB/6L3+1f8A+JHeOf8A54NH/EVfD/8A6KTDf+EuYf8AzGH/ABIJ9L3/AKMpnn/h84O/+iM/sr/4cW+FP+jjfEP/AIbbTf8A5sa/52/+Kg+cf9Gvyz/xKcV/84z/AGL/AOJ9s3/6Nrlv/iTYr/5zB/w4t8Kf9HG+If8Aw22m/wDzY0f8VB84/wCjX5Z/4lOK/wDnGH/E+2b/APRtct/8SbFf/OYP+HFvhT/o43xD/wCG203/AObGj/ioPnH/AEa/LP8AxKcV/wDOMP8AifbN/wDo2uW/+JNiv/nMH/Di3wp/0cb4h/8ADbab/wDNjR/xUHzj/o1+Wf8AiU4r/wCcYf8AE+2b/wDRtct/8SbFf/OY/rl/4Q3wh/0Kvhv/AMEemf8AyLX9pf8AEH/CT/o1vhz/AOIRwz/87D/Er/WPiH/ofZz/AOHTHf8Ay8P+EN8If9Cr4b/8Eemf/ItH/EH/AAk/6Nb4c/8AiEcM/wDzsD/WPiH/AKH2c/8Ah0x3/wAvD/hDfCH/AEKvhv8A8Eemf/ItH/EH/CT/AKNb4c/+IRwz/wDOwP8AWPiH/ofZz/4dMd/8vD/hDfCH/Qq+G/8AwR6Z/wDItH/EH/CT/o1vhz/4hHDP/wA7A/1j4h/6H2c/+HTHf/Lw/9k="
            alt=""
          />
          <span>Deutsch</span>
        </ButtonStyled>
      </Stack>
      <NewsList news={news} update={mutate} loading={newsLoading} />
    </Container>
  );
};

export default NewsListView;

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
