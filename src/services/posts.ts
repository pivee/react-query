export async function getPosts() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts');
  return posts.json();
}