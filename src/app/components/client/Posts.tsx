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
        data && data.map((post) => (
          <div key={post.id}>
            <h2>{post.title} <small>By {post.User.name}</small></h2>
            <blockquote>
              <strong>{post.content}</strong>
            </blockquote>
          </div>
        ))
      }
    </div>
  )
}
