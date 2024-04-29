import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import NewsCard from './news-card';
import { INewPost } from '../../types/news';
import { NewsSkeleton } from './news-skeleton';

type Props = {
  news: INewPost[];
  loading?: boolean;
  disabledIndex?: boolean;
  update: VoidFunction;
};

export const NewsList = ({ news, loading, disabledIndex, update }: Props) => {
  const renderSkeleton = (
    <>
      {[...Array(4)].map((_, index) => (
        <NewsSkeleton key={index} variant="horizontal" />
      ))}
    </>
  );

  const renderList = (
    <>
      {news.map((post) => (
        <NewsCard key={post.id} update={update} post={post} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {news.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
};
