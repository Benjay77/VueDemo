import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./styles/main.scss";
import VueCompositionApi from "@vue/composition-api";
import "./router/navigationGuards.js";

// 自定义全局组件
import "./icons";

Vue.use(ElementUI);
Vue.use(VueCompositionApi);
Vue.config.productionTip = false;

// runtime模式(默认指向dist/vue.runtime.common.js  编译全局组件会报错)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// compiler(模板)模式
/**
 * new Vue({
  el: "#app",
  router: router,
  store: store,
  template: '<App/>',
  component: {App}
})*/
