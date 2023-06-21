import { generateToken } from '../utils/generateToken';

const JSON_SERVER_URL = process.env.JSON_SERVER_URL;
/**
 * 서버로부터 계정 목록을 가져옵니다.
 * @returns {Promise<[]>} 계정 목록
 */
export async function getAccounts() {
  const res = await fetch(`${JSON_SERVER_URL}/accounts`);

  if (!res.ok) {
    throw new Error(`Failed to fetch accounts, ${res.status}`);
  }

  const data = await res.json();
  return data;
}

/**
 * 서버로부터 id를 통해 계정을 가져옵니다.
 * @param {*} id
 * @returns {Promise<{}>} 계정
 */
export async function getAccountById(id) {
  const res = await fetch(`${JSON_SERVER_URL}/accounts/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch account, ${res.status}`);
  }

  const data = await res.json();
  return data;
}

export async function getAccountByNickname(nickname) {
  const accounts = await getAccounts();

  const account = accounts.find((account) => account.nickname === nickname);

  return account;
}

/**
 * 서버로부터 id를 통해 계정을 업데이트합니다.
 * @param {*} id
 * @param {string} userToken
 */
export async function updateUserToken(id, userToken) {
  const res = await fetch(`${JSON_SERVER_URL}/accounts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userToken }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update user token, ${res.status}`);
  }
}

/**
 * 서버에 로그인을 요청합니다.
 * @param {string} nickname
 * @param {string} password
 * @returns {Promise<string>} account id
 */
export async function login(nickname, password) {
  const accounts = await getAccounts();

  const account = accounts.find(
    (account) => account.nickname === nickname && account.password === password
  );

  if (!account) {
    throw new Error('Invalid username or password');
  }

  const token = generateToken();

  await updateUserToken(account.id, token);

  return token;
}

/**
 * 서버에 로그온 요청을 합니다.
 * @param {string} userToken
 * @returns {Promise<string>} account id
 */
export async function logon(userToken) {
  const accounts = await getAccounts();

  const account = accounts.find((account) => account.userToken === userToken);

  if (!account) {
    throw new Error('Invalid user token');
  }

  return account;
}

export async function createAccount(account) {
  const res = await fetch(`${JSON_SERVER_URL}/accounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(account),
  });

  if (!res.ok) {
    throw new Error(`Failed to create account, ${res.status}`);
  }
}

export async function updateProfileImg(id, img) {
  const res = await fetch(`${JSON_SERVER_URL}/accounts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ img }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update profile image, ${res.status}`);
  }
}
