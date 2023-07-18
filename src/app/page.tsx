import Post from '@/components/Posts';
import { PostsService } from '@/services/posts';
import { dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '../utils/getQueryClient';
import { Hydrate } from '../utils/hydrateClient';

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(['posts'], PostsService.getPosts);
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Hydrate state={dehydratedState}>
        <Post />
      </Hydrate>
    </main>
  )
}
