import InfiniteScroll from 'react-infinite-scroller';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Person } from './Person';

const initialUrl = 'https://swapi.dev/api/people/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  // TODO: get data for InfiniteScroll via React Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['sw-people'],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next || undefined; // hasNextPage
    },
  });

  const loadMore = () => {
    if (isFetching) return;
    fetchNextPage();
  };

  if (isLoading) return <div className='loading'>Loading...</div>;
  if (isError) return <div className='error'>{error.message}</div>;

  return (
    <>
      {isFetching && <div className='loading'>Loading...</div>}
      <InfiniteScroll loadMore={loadMore} hasMore={hasNextPage}>
        {data.pages.map((_pageData) =>
          _pageData.results.map((_person) => (
            <Person key={_person.name} {..._person} />
          )),
        )}
      </InfiniteScroll>
    </>
  );
}
