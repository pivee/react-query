'use client'

import { getPosts } from '@/services/posts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'

export type PostProps = {
  id: number;
  title: string;
  body: string;
}

const Posts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
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