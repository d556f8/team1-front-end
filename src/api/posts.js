const JSON_SERVER_URL = process.env.JSON_SERVER_URL;
/**
 * 서버에서 포스트 목록을 받아옵니다.
 * @returns {Promise<[]>} 포스트 목록
 */
export async function getPost() {
  const res = await fetch(`${JSON_SERVER_URL}/posts`);
  const data = await res.json();
  return data;
}

/**
 * 서버에서 id를 통해 포스트를 받아옵니다.
 * @param {*} post
 * @returns {Promise<{}>} 포스트
 */
export async function createPost(post) {
  const res = await fetch(`${JSON_SERVER_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
}

export async function deletePost(id) {
  const res = await fetch(`${JSON_SERVER_URL}/posts/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  return data;
}

export async function getPostById(id) {
  const res = await fetch(`${JSON_SERVER_URL}/posts/${id}`);
  const data = await res.json();
  return data;
}

export async function updatePost(id, post) {
  const res = await fetch(`${JSON_SERVER_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  const data = await res.json();
  return data;
}