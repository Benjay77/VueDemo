import { GetCategory, GetCategoryAll } from "./news";
import { reactive } from "@vue/composition-api";

export function common() {
  const categoryItems = reactive({
    item: []
  });
  // 获取分类
  const getInfoCategory = () => {
    GetCategory()
      .then(response => {
        categoryItems.item = response.data.data.data;
      })
      .catch(error => {
        console.log(error);
      });
  };

  // 获取所有层级分类
  const getInfoCategoryAll = () => {
    GetCategoryAll()
      .then(response => {
        categoryItems.item = response.data.data;
      })
      .catch(error => {
        console.log(error);
      });
  };

  return {
    categoryItems,
    getInfoCategory,
    getInfoCategoryAll
  };
}
