import axios from "axios";
import { Message } from "element-ui";
import { getToken, getUserName } from "../utils/app";

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devapi";

const instance = axios.create({
  baseURL: BASEURL,
  timeout: 10000
  // headers: { "X-Custom-Header": "foobar" }
});

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 根据业务需求后台每个接口需要的数据
    config.headers.Tokey = getToken();
    config.headers.UserName = getUserName();
    // config.headers.Token = getToken();
    // config.headers.UserId = getUserName();
    return config;
  },

  error =>
    // 对请求错误做些什么
    Promise.reject(error)
);

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    if (response.data.resCode !== 0) {
      Message({
        showClose: true,
        message: response.data.message,
        type: "error"
      });
      return Promise.reject(response.data);
    } else {
      return Promise.resolve(response);
    }
  },
  error =>
    // 对响应错误做点什么
    Promise.reject(error)
);

export default instance;
