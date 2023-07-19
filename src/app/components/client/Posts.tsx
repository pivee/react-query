'use client'

import { Post, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { PostsService } from '../../api/v1/posts/service';

export default function Posts() {
  const { data, isLoading } = useQuery<(Post & { User: User })[]>({
    queryKey: ['posts'],
    queryFn: () => PostsService.getPosts(),
  })

  return (
    <div>
      {
        data && data.map((post) => {
          const title = `${post.title} by ${post.User.name}`;
          
          return (
            <div key={post.id}>
              <h2>{title}</h2>
              <p>
                <strong>{post.content}</strong>
              </p>
              <button onClick={() => alert(title)}>Delete</button>
            </div>
          )
        })
      }
    </div>
  )
}
