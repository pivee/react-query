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
