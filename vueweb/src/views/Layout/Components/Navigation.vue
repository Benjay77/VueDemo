<template>
  <div id="nav-wrap">
    <h1 class="logo">
      <img src="../../../assets/logo.png" alt="" />
    </h1>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <!--解决v-if v-for同一元素 使用Element template-->
      <template v-for="(item, index) in routers">
        <el-submenu v-if="!item.hidden" :key="item.id" :index="index + ''">
          <!--一级菜单-->
          <template slot="title">
            <svg-icon
              :iconClass="item.meta.icon"
              :className="item.meta.icon"
            ></svg-icon>
            <span slot="title">{{ item.meta.name }}</span>
          </template>
          <!--二级菜单-->
          <template v-for="subItem in item.children">
            <el-menu-item
              v-if="!subItem.hidden"
              :key="subItem.id"
              :index="subItem.path"
            >
              {{ subItem.meta.name }}
            </el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { reactive, computed } from "@vue/composition-api";
export default {
  name: "NavMenu",
  setup(props, { root }) {
    // computed监听属性变化
    const isCollapse = computed(() => root.$store.state.app.isCollapse);
    const routers = reactive(root.$router.options.routes);

    return {
      isCollapse,
      routers
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";
#nav-wrap {
  left: 0;
  position: fixed;
  background-color: #344a5f;
  top: 0;
  height: 100vh;
  @include webkit(transition, all 0.3s ease 0s);
  svg {
    font-size: 20px;
    margin-right: 10px;
  }
}

.logo {
  text-align: center;
  img {
    margin: 28px auto 25px;
    width: 92px;
    @include webkit(transition, all 0.3s ease 0s);
  }
}

.open {
  #nav-wrap {
    width: $navMenu;
  }
}

.close {
  #nav-wrap {
    width: $navMenuMin;
  }
  .logo img {
    width: 60%;
  }
}
</style>
