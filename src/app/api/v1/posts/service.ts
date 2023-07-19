export namespace PostsService {
  export async function getPosts() {
    const posts = await fetch('/api/v1/posts');

    if(!posts.ok) throw new Error('Failed to fetch posts');
    
    return posts.json();
  }
}
