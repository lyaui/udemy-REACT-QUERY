import { useQuery } from '@tanstack/react-query';
import { fetchComments } from './api';
import './PostDetail.css';

export function PostDetail({ post, deletePostMutation }) {
  // replace with useQuery
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => fetchComments(post.id),
  });

  if (isLoading) return <h3>Loading...</h3>;
  if (isError) return <h3>{error.message}</h3>;

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <div>
        <button
          onClick={() => {
            deletePostMutation.mutate(post.id);
          }}
        >
          Delete
        </button>
        {deletePostMutation.isPending && (
          <p className='loading'>Deleting the post</p>
        )}
        {deletePostMutation.isError && (
          <p className='error'>
            Error deleting the post : {deletePostMutation.error.message}
          </p>
        )}
        {deletePostMutation.isSuccess && (
          <p className='success'>Post was (not) deleted</p>
        )}
      </div>
      <div>
        <button>Update title</button>
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
