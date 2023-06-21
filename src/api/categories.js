const JSON_SERVER_URL = process.env.JSON_SERVER_URL;
/**
 * 서버로부터 카테고리 목록을 가져옵니다.
 * @returns {Promise<[]>} 카테고리 목록
 */
export async function getCategories() {
  const response = await fetch(`${JSON_SERVER_URL}/categories`);
  const data = await response.json();
  return data;
}
