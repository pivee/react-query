# React Query integration on NextJS 13

- You need the following pieces working together to implement `@tanstack/react-query`:
    - Prisma - Optional
    - API Service
    - API Route
    - React Query Utils
    - Server Component
    - Client Component - to enable controls

## Prisma

1. Fist setup Prisma for the project somehow.
2. Generate `PrimsClient`.
3. Create `src/libraries/prisma/index.ts`.
    
    ```tsx
    import { PrismaClient } from "@prisma/client";
    
    const globalForPrisma = global as unknown as { prisma: PrismaClient };
    
    export const prisma =
      globalForPrisma.prisma ||
      new PrismaClient({
        log: ["query"],
      });
    
    if (process.env.NODE_ENV != "production") globalForPrisma.prisma;
    ```
    

## API Service

`src/services/posts.ts`

```tsx
import { BASE_URL } from '@/constants';
import { Post } from '@prisma/client';

export namespace PostsService {
  export async function getPosts() {
    const posts = await fetch(`${BASE_URL}/api/v1/posts`);

    if(!posts.ok) throw new Error('Failed to fetch posts');
    
    return posts.json();
  }

  export async function deletePost(deletedPost: Post) {
    const response = await fetch(`${BASE_URL}/api/v1/posts`, {
      method: 'DELETE',
      body: JSON.stringify(deletedPost),
    });

    if(!response.ok) throw new Error('Failed to delete post');
  }
}
```

## API Route

`src/app/api/v1/posts/route.ts`

```tsx
import { prisma } from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      User: true
    }
  });

  return NextResponse.json(posts);
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();

  if(!body.id) return NextResponse.error().json();
 
  const post = await prisma.post.delete({
    where: {
      id: body.id
    }
  });

  return NextResponse.json(post);
}
```

## React Query Utils

### `getQueryClient.ts`

`src/utils/getQueryClient.ts`

```tsx
import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

export const getQueryClient = cache(() => new QueryClient());
```

### `hydrateClient.tsx`

`src/utils/hydrateClient.tsx`

```tsx
'use client'

import { Hydrate as RQHydrate, type HydrateProps } from '@tanstack/react-query';

/**
 * This file may be redundant in the future, but for now it's needed to avoid a type error.
 */
export function Hydrate(props: HydrateProps) {
  return <RQHydrate {...props} />;
}
```

### `providers.tsx`

`src/utils/providers.tsx`

```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

## Server Component

```tsx
import { dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '../../utils/getQueryClient';
import { Hydrate } from '../../utils/hydrateClient';
import { PostsService } from '../../services/posts';
import Posts  from '../client/Posts';

export default async function PostSection() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(['posts'], PostsService.getPosts);
  const dehydratedState = dehydrate(queryClient);
  
  return (
    <Hydrate state={dehydratedState}>
      <Posts />
    </Hydrate>
  )
}
```

## Client Component

### Get and Delete data

```tsx
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
```