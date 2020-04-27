<template>
  <div id="header-wrap">
    <div class="pull-left header-icon" @click="navMenuState">
      <svg-icon iconClass="menu" className="menu"></svg-icon>
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">
        <div>{{ userName }}</div>
      </div>
      <div class="header-icon pull-left" @click="exit">
        <svg-icon iconClass="exit" className="exit"></svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";
export default {
  name: "LayoutHeader",
  setup(props, { root }) {
    const userName = computed(() => {
      root.$store.state.app.userName;
    });
    const navMenuState = () => {
      root.$store.commit("app/SET_COLLAPSE");
    };
    // 退出
    const exit = () => {
      root.$store.dispatch("app/exit").then(() => {
        root.$router.push({
          name: "Login"
        });
      });
    };
    return {
      navMenuState,
      userName,
      exit
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";
#header-wrap {
  position: fixed;
  top: 0;
  left: $navMenu;
  right: 0;
  height: 75px;
  background-color: white;
  line-height: 75px;
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition, all 0.3s ease 0s);
}

.header-icon {
  padding: 0 32px;
  svg {
    margin-bottom: -8px;
    font-size: 25px;
    cursor: pointer;
  }
}

.open {
  #header-wrap {
    left: $navMenu;
  }
}

.close {
  #header-wrap {
    left: $navMenuMin;
  }
}

.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  + .header-icon {
    padding: 0 28px;
  }
}
</style>
