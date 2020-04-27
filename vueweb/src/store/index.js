import Vue from "vue";
import Vuex from "vuex";
import app from "./Modules/app.js";
import common from "./Modules/common.js";

Vue.use(Vuex);

/** Vuex
 * Vuex是利用vue的mixin混入机制，在beforeCreate（setup3.0）钩子前混入vueInit方法，vuexInit方法实现了store
 * 注入vue组件实例，并注册了vuex store的引用属性$store
 */

export default new Vuex.Store({
  modules: {
    app,
    common
  } // store 分割的模块 每一个都有独立的state、getters、mutations、actions
});
