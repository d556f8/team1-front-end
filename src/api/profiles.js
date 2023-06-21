const JSON_SERVER_URL = process.env.JSON_SERVER_URL;
/**
 * 서버에서 프로필 목록을 가져옵니다.
 * @returns {Promise<Profile[]>} 프로필 목록
 */
export async function getProfiles() {
  const res = await fetch(`${JSON_SERVER_URL}/profiles`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to fetch profiles, ${res.status}`);
  }
  return data;
}

/**
 * 서버에서 id를 통해 프로필을 가져옵니다.
 * @param {*} id
 * @returns {Promise<{}>} 프로필
 */
export async function getProfileById(id) {
  const data = await getProfiles();
  const newData = data.find((profile) => profile.userId === id);
  if (!newData) {
    throw '404';
  }
  return newData;
}

/**
 * 서버에서 id를 통해 프로필을 업데이트합니다.
 * @param {*} id
 * @param {*} storyImg
 * @param {*} storyText
 * @returns {Promise<{}>} 업데이트된 프로필
 */
export async function updateProfile(data) {
  const res = await fetch(`${JSON_SERVER_URL}/profiles/${data.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to update profile, ${res.status}`);
  }

  return res.json
}

/**
 * 서버에서 id를 통해 프로필을 삭제합니다.
 * @param {*} id
 * @returns {Promise<{}>} 삭제된 프로필
 */
export async function deleteProfile(id) {
  const data = await getProfiles();
  const newData = data.find((profile) => profile.userId === id);
  await fetch(`${JSON_SERVER_URL}/profiles/${newData.id}`, {
    method: 'DELETE',
  });
}

/**
 * 서버에 프로필을 추가합니다.
 * @param {*} data
 * @returns
 */
export async function postProfile(data) {
  const res = await fetch(`${JSON_SERVER_URL}/profiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Server responded with status: ${res.status}`);
  }

  return res.json();
}
