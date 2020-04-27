import router from "./index.js";
import { getToken, removeToken, removeUserName } from "@u/app.js";
import store from "@/store/index";

// const whiteRoutes = ["/login"];

// 全局路由守卫
// to：下一个页面  from：上一个页面
// next：不带参数 执行to中的页面 参数false 路由中断 回到from的页面
// next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
// 你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项以及任何用在
// router - link 的 to prop 或 router.push 中的选项
router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.path === "/login") {
      removeToken(); // 清除cookie_js里的token
      removeUserName(); // 清除cookie_js里的username
      store.commit("app/SET_TOKEN", ""); // 清除store中存储的token
      store.commit("app/SET_USERNAME", ""); // 清除store中存储的username
    }
    next();
  }
  // else if (whiteRoutes.indexOf(to.path) !== -1) {
  //   next();
  // } else {
  //   next("/login");
  // }
  next();
});
