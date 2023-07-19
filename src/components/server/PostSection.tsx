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
