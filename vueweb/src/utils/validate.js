/** 过滤特殊字符
 * @method stripscript
 * @for validate.js
 * @param {string} str 输入值
 * @return {string} 返回值
 */
export function stripscript(str) {
  const patten = new RegExp(
    "[`~!@#$%^&*()=|{}':;',\\[\\].<>/?！￥……（）——|{ }【】‘：；“”’。，、？]"
  );
  let rs = "";
  for (let index = 0; index < str.length; index++) {
    rs = rs + str.substr(index, 1).replace(patten, "");
  }
  return rs;
}

/** 验证邮箱
 * @method checkEmail
 * @for validate.js
 * @param {string} value 输入值
 * @return {boolean} 返回值
 */
export function checkEmail(value) {
  const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
  return !reg.test(value);
}

/** 验证密码
 * @method checkPassword
 * @for validate.js
 * @param {string} value 输入值
 * @return {boolean} 返回值
 */
export function checkPassword(value) {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,20}$/;
  return !reg.test(value);
}

/** 验证验证码
 * @method checkCode
 * @for validate.js
 * @param {string} value 输入值
 * @return {boolean} 返回值
 */
export function checkCode(value) {
  const reg = /^[a-z0-9]{6}$/;
  return !reg.test(value);
}
