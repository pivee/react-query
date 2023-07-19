'use client'

import { Post, User } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PostsService } from '../../services/posts';

export default function Posts() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<(Post & { User: User })[]>({
    queryKey: ['posts'],
    queryFn: () => PostsService.getPosts(),
  })

  const deletePostMutation = useMutation({
    mutationFn: PostsService.deletePost,
    onMutate: async (deletedPost) => {
      queryClient.cancelQueries({ queryKey: ['posts'] });
      // Get a snapshot of the previous value
      const previousPosts = queryClient.getQueryData<(Post & { User: User })[]>(['posts']);
      // Optimistically update to the new value
      queryClient.setQueryData<(Post & { User: User })[]>(['posts'], (old) => {
        return old?.filter((post) => post.id !== deletedPost.id) ?? [];
      });
      // Return a context object with the snapshot value
      return { previousPosts };
    },
    onError: (err, deletedPost, context) => {
      // If an error happens, roll back to the snapshot value
      queryClient.setQueryData<(Post & { User: User })[]>(['posts'], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['posts']);
    }
  })

  return (
    <div>
      {
        !isLoading && data && data.map((post) => {
          const title = `${post.title} by ${post.User.name}`;
          
          return (
            <div key={post.id}>
              <h2>{title}</h2>
              <p>
                <strong>{post.content}</strong>
              </p>
              <button onClick={() => deletePostMutation.mutate(post)}>Delete</button>
            </div>
          )
        })
      }
    </div>
  )
}
