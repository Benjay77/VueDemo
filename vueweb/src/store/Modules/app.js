import { Login } from "@/api/login.js";
import {
  setToken,
  removeToken,
  setUserName,
  getUserName,
  removeUserName
} from "@u/app.js";

const state = {
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
  token: "",
  userName: getUserName() || ""
}; // 存储的单一状态 存储的基本数据

const getters = {
  isCollapse: state => state.isCollapse
}; // 过滤或计算state中的属性值 得到的结果会根据依赖缓存起来 只有依赖值发生改变才重新计算

const mutations = {
  SET_COLLAPSE(state) {
    state.isCollapse = !state.isCollapse;
    // html5本地存储 sessionStorage 临时性 localStorage 长期性 大小5M 存储类型 string 简单的对象和交互
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
    // cookie.js 携带请求头 业务需求
  },
  SET_TOKEN(state, value) {
    state.token = value;
  },
  SET_USERNAME(state, value) {
    state.userName = value;
  }
}; // 更改state里的属性值 使用store.commit 同步函数 专注于修改state

const actions = {
  login({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      Login(requestData)
        .then(response => {
          console.log(response);
          commit("SET_TOKEN", response.data.data.token);
          commit("SET_USERNAME", response.data.data.username);
          setToken(response.data.data.token);
          setUserName(response.data.data.username);
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  exit(content) {
    return new Promise(resolve => {
      content.commit("SET_TOKEN", "");
      content.commit("SET_USERENAME", "");
      removeToken();
      removeUserName();
      resolve();
    });
  }
}; // 既可以处理异步也可以处理同步（视图触发action action触发mutations提交） 业务代码、异步请求

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
