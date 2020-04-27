import instance from "@/utils/request.js";

/** 登录
 * @method Login
 * @for login.js
 * @param {string} data 输入值
 * @return {JSON} 返回值
 */
export function Login(data) {
  return instance.request({
    method: "post",
    url: "/login/",
    data
  });
}

/** 注册
 * @method Register
 * @for login.js
 * @param {string} data 输入值
 * @return {JSON} 返回值
 */
export function Register(data) {
  return instance.request({
    method: "post",
    url: "/register/",
    data
  });
}

/** 获取验证码
 * @method GetSms
 * @for login.js
 * @param {string} data 输入值
 * @return {JSON} 返回值
 */
export function GetSms(data) {
  return instance.request({
    method: "post",
    url: "/getSms/",
    data // 如果参数和变量名相同 只用写一个(ES6写法)
  });
}
