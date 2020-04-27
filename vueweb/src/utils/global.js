import { MessageBox } from "element-ui";
import { ref } from "@vue/composition-api";
// vue 3.0写法
export function global() {
  const str = ref(""); // 通过此变量区分执行相关逻辑
  const confirm = params => {
    MessageBox.confirm(params.content, params.tip || "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: params.type || "warning",
      center: true
    })
      .then(() => {
        str.value = params.id || "";
        params.fn && params.fn(params.id || "");
      })
      .catch(() => {
        params.catchFn && params.catchFn();
      });
  };

  return {
    str,
    confirm
  };
}
