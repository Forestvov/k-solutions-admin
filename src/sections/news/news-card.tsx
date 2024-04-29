import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { INewPost } from '../../types/news';
import { deleteNews } from '../../api/news';

// ----------------------------------------------------------------------

type Props = {
  post: INewPost;
  update: VoidFunction;
};

export default function PostItemHorizontal({ post, update }: Props) {
  const popover = usePopover();

  const router = useRouter();

  const smUp = useResponsive('up', 'sm');

  const { title, photo, id, newsType, descriptions, createdDate } = post;

  const deleteNew = async (newId: number) => {
    await deleteNews(newId);
    await update();
  };

  return (
    <>
      <Stack component={Card} justifyContent="space-between" direction="row">
        <Stack
          sx={{
            width: '100%',
            p: (theme) => theme.spacing(3, 3, 2, 3),
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            {newsType ? (
              <Label variant="soft" color="info">
                {newsType}
              </Label>
            ) : (
              <div />
            )}

            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(createdDate)}
            </Box>
          </Stack>

          <Stack spacing={1} flexGrow={1}>
            <TextMaxLine variant="subtitle2" line={2}>
              {title}
            </TextMaxLine>

            <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
              {descriptions}
            </TextMaxLine>
          </Stack>

          <Stack direction="row" alignItems="center">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          </Stack>
        </Stack>

        {smUp && (
          <Box
            sx={{
              width: 180,
              height: 240,
              position: 'relative',
              flexShrink: 0,
              p: 1,
            }}
          >
            <Image alt={title} src={photo} sx={{ height: 1, width: 1, borderRadius: 1.5 }} />
          </Box>
        )}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.news.edit(String(id)));
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            deleteNew(id);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
