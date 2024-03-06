import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { fetchPosts, deletePost, updatePost } from './api';
import { PostDetail } from './PostDetail';
const maxPostPage = 10;

export function Posts() {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const deletePostMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });

  console.log({ deletePostMutation });

  // replace with useQuery
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000,
  });

  useEffect(() => {
    if (currentPage === maxPostPage) return;

    const nextPage = currentPage + 1;
    queryClient.prefetchQuery({
      queryKey: ['posts', nextPage],
      queryFn: () => fetchPosts(nextPage),
    });
  }, [currentPage, queryClient]);

  if (isLoading) return <h3>Loading...</h3>;
  if (isError) return <h3>{error.message}</h3>;

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className='post-title'
            onClick={() => {
              deletePostMutation.reset();
              setSelectedPost(post);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className='pages'>
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((_cur) => _cur - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((_cur) => _cur + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          deletePostMutation={deletePostMutation}
        />
      )}
    </>
  );
}
