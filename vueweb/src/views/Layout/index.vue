<template>
  <div id="layout" :class="[menuStatus ? 'close' : 'open']">
    <LayoutHeader />
    <LayoutMain />
    <LayoutNavigation />
  </div>
</template>

<script>
import LayoutHeader from "./Components/Header";
import LayoutMain from "./Components/Main";
import LayoutNavigation from "./Components/Navigation";
import { computed } from "@vue/composition-api";
export default {
  name: "Layout",
  components: {
    LayoutHeader,
    LayoutMain,
    LayoutNavigation
  },
  setup(props, { root }) {
    const menuStatus = computed(() => root.$store.state.app.isCollapse);
    return {
      menuStatus
    };
  }
};
</script>

<style lang="scss" scoped></style>
