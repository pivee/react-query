'use client'

import { PostsService } from '@/services/posts';
import { useQuery } from '@tanstack/react-query';

export type PostProps = {
  id: number;
  title: string;
  body: string;
}

const Posts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: PostsService.getPosts
  })

  return (
    <div>
      {
        data.map((post: PostProps) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
        ))
      }
    </div>
  )
}

export default Posts