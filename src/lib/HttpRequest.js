import { log, error } from 'my/lib/Log';

export const getCookies = async function () {
  try {
    const cookies = await chrome.cookies.getAll({});
    return cookies;
  } catch (e) {
    error(e);
  }
};

const convertHeaderCookie = function (cookies) {
  let header_cookies = '';
  cookies.forEach((cookie) => {
    header_cookies += `${cookie.name}=${cookie.value}; `;
  });
  return header_cookies;
};
export const postWithCredentials = async function (URL, cookies, payload) {
  const response = await fetch(URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Cookie: convertHeaderCookie(cookies),
    },
    body: encodeURI(payload),
  }).then((response) => response.json());
  return response;
};

export const getWithCredentials = async function (URL, cookies) {
  const response = await fetch(URL, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      Accept: '*/*',
      'Content-Type': 'text/html;charset=UTF-8',
      Cookie: convertHeaderCookie(cookies),
    },
  })
    .then((response) => response.text())
    .then((text) => {
      return new DOMParser().parseFromString(text, 'text/html');
    });
  return response;
};

export const getBlobWithCredentials = async function (URL, cookies) {
  const response = await fetch(URL, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      Accept: '*/*',
      Cookie: convertHeaderCookie(cookies),
    },
  }).then((response) => response.blob());
  return response;
};
