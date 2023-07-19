'use client'

import { Post, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { PostsService } from '../../services/posts';

export default function Posts() {
  const { data, isLoading } = useQuery<(Post & { User: User })[]>({
    queryKey: ['posts'],
    queryFn: () => PostsService.getPosts(),
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
              <button onClick={() => PostsService.deletePost(post)}>Delete</button>
            </div>
          )
        })
      }
    </div>
  )
}
