import cookie from "cookie_js";

const adminToken = "admin_Token";
const userName = "username";

export function getToken() {
  return cookie.get(adminToken);
}

export function setToken(token) {
  return cookie.set(adminToken, token);
}

export function removeToken() {
  return cookie.remove(adminToken);
}

export function getUserName() {
  return cookie.get(userName);
}

export function setUserName(user) {
  return cookie.set(userName, user);
}

export function removeUserName() {
  return cookie.remove(userName);
}
