<template>
  <div id="category">
    <el-button type="danger" @click="addFirstCategory">
      添加一级分类
    </el-button>
    <hr class="hr-style" />
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category-wrap">
            <!-- <div
              v-for="firstItem in category.item"
              :key="firstItem.id"
              class="category"
            >
              <h4>
                <svg-icon icon-Class="plus"></svg-icon>
                {{ firstItem.categoryName }}
                <div class="button-group">
                  <el-button
                    size="mini"
                    type="danger"
                    round
                    @click="
                      editFirstCategory({
                        data: firstItem
                      })
                    "
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="success"
                    round
                    @click="addSecondCategory({ data: firstItem })"
                  >
                    添加子级
                  </el-button>
                  <el-button
                    size="mini"
                    round
                    @click="deleteCategoryConfirm(firstItem.id)"
                  >
                    删除
                  </el-button>
                </div>
              </h4>
              <ul v-if="firstItem.children">
                <li
                  v-for="secondItem in firstItem.children"
                  :key="secondItem.id"
                >
                  {{ secondItem.categoryName }}
                  <div class="button-group">
                    <el-button size="mini" type="danger" round>
                      编辑
                    </el-button>
                    <el-button size="mini" round>
                      删除
                    </el-button>
                  </div>
                </li>
              </ul>
            </div> -->
            <div class="category">
              <h4>
                <svg-icon iconClass="plus"></svg-icon>
                新闻
                <div class="button-group">
                  <el-button
                    size="mini"
                    type="danger"
                    round
                    @click="
                      editFirstCategory({
                        data: firstItem
                      })
                    "
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="success"
                    round
                    @click="addSecondCategory({ data: firstItem })"
                  >
                    添加子级
                  </el-button>
                  <el-button
                    size="mini"
                    round
                    @click="deleteCategoryConfirm(firstItem.id)"
                  >
                    删除
                  </el-button>
                </div>
              </h4>
              <ul>
                <li>
                  1
                  <div class="button-group">
                    <el-button size="mini" type="danger" round>
                      编辑
                    </el-button>
                    <el-button size="mini" round>
                      删除
                    </el-button>
                  </div>
                </li>
                <li>1</li>
                <li>1</li>
                <li>1</li>
                <li>1</li>
                <li>1</li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <h4 class="menu-title">
            一级分类编辑
          </h4>
          <el-form ref="categoryForm" label-width="142px" class="form-wrap">
            <el-form-item
              v-if="firstCategory"
              label="一级分类名称："
              prop="firstCategoryName"
            >
              <el-input
                v-model="formCategory.firstCategoryName"
                :disabled="firstCategoryStatus"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="secondCategory"
              label="二级分类名称："
              prop="secondCategoryName"
            >
              <el-input
                v-model="formCategory.secondCategoryName"
                :disabled="secondCategoryStatus"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                :loading="submitLoadingStatus"
                :disabled="submitStatus"
                @click="submit"
              >
                确定
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  AddFirstCategory,
  DeleteCategory,
  EditCategory,
  AddSecondCategory
} from "@/api/news";
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
import { global } from "@/utils/global";
import { common } from "@/api/common";
export default {
  name: "InfoCategory",
  setup(props, { refs, root }) {
    const { confirm } = global();
    const { categoryItems, getInfoCategoryAll } = common();
    // 显示一级分类名称
    const firstCategory = ref(true);
    // 显示二级分类名称
    const secondCategory = ref(true);
    // 提交按钮加载状态
    const submitLoadingStatus = ref(false);
    // 一级分类名称输入状态
    const firstCategoryStatus = ref(true);
    // 二级分类名称输入状态
    const secondCategoryStatus = ref(true);
    // 提交按钮状态
    const submitStatus = ref(true);
    // 存储的需要删除的类别ID
    const deletedId = ref("");
    // 是否是一级分类 true：一级 false：二级
    const isCategoryFirst = ref(true);
    // 是否是添加操作 true：添加 false：编辑
    const isCategoryAdd = ref(true);
    // 表单数据
    const formCategory = reactive({
      firstCategoryName: "",
      secondCategoryName: ""
    });
    // 列表数据
    const category = reactive({
      // vue 3.0 不要在对象里直接写数组 设置变量然后接口获取再赋值
      items: [
        {
          id: "1",
          categoryName: "国际信息",
          children: [
            {
              id: "10",
              categoryName: "国际"
            }
          ]
        },
        {
          id: "2",
          categoryName: "国内信息",
          children: [
            {
              id: "20",
              categoryName: "国内"
            },
            {
              id: "21",
              categoryName: "中国"
            }
          ]
        }
      ],
      operateItem: []
    });
    // 添加一级分类
    const addFirstCategory = () => {
      isCategoryFirst.value = true;
      isCategoryAdd.value = true;
      firstCategory.value = true;
      secondCategory.value = false;
      firstCategoryStatus.value = false;
      secondCategoryStatus.value = false;
      submitStatus.value = false;
    };
    // 添加一级分类提交调用方法
    const addFirstCategoryMethod = () => {
      if (!formCategory.firstCategoryName) {
        root.$message({
          showClose: true,
          message: "一级分类名称不可为空！",
          type: "warning"
        });
        submitLoadingStatus.value = false;
        return false;
      }
      AddFirstCategory({ categoryName: formCategory.firstCategoryName })
        .then(response => {
          if (response.data.rescode === 0) {
            root.$message({
              showClose: true,
              message: response.data.message,
              type: "success"
            });
            // 添加成功 刷新分类列表
            category.items.push(response.data.data);
            // 清除输入信息
            refs.categoryForm.resetFields();
            formCategory.firstCategoryName.value = "";
            formCategory.secondCategoryName.value = "";
            // 恢复相关输入和按钮原始状态
            secondCategory.value = true;
            firstCategoryStatus.value = true;
            secondCategoryStatus.value = true;
            submitStatus.value = true;
          } else {
            root.$message({
              showClose: true,
              message: response.data.message,
              type: "error"
            });
          }
          submitLoadingStatus.value = false;
        })
        .catch(error => {
          console.log(error);
          submitLoadingStatus.value = false;
          // 清除输入信息
          refs.categoryForm.resetFields();
          formCategory.firstCategoryName.value = "";
          formCategory.secondCategoryName.value = "";
          // 恢复相关输入和按钮原始状态
          secondCategory.value = true;
          firstCategoryStatus.value = true;
          secondCategoryStatus.value = true;
          submitStatus.value = true;
        });
    };
    // 编辑一级分类
    const editFirstCategory = params => {
      isCategoryFirst.value = true;
      isCategoryAdd.value = false;
      firstCategory.value = true;
      secondCategory.value = false;
      firstCategoryStatus.value = false;
      submitStatus.value = false;
      category.operateItem = params.data;
      formCategory.firstCategoryName = params.data.categoryName;
    };
    // 编辑一级分类提交调用方法
    const editFirstCategoryMethod = () => {
      if (category.operateItem.length === 0) {
        root.$message({
          showClose: true,
          message: "未选择分类！！！！",
          type: "warning"
        });
        return false;
      }
      const requestData = {
        id: category.operateItem.id,
        categoryName: formCategory.firstCategoryName
      };
      EditCategory(requestData)
        .then(response => {
          root.$message({
            showClose: true,
            message: response.data.message,
            type: "success"
          });
          // 修改列表数据
          category.operateItem.categoryName =
            response.data.data.data.categoryName;
          // 清除输入信息
          refs.categoryForm.resetFields();
          formCategory.firstCategoryName.value = "";
          formCategory.secondCategoryName.value = "";
          // 恢复相关输入和按钮原始状态
          secondCategory.value = true;
          firstCategoryStatus.value = true;
          secondCategoryStatus.value = true;
          submitStatus.value = true;
          isCategoryAdd.value = true;
          category.operateItem = [];
        })
        .catch(error => {
          console.log(error);
        });
    };
    // 删除一级分类
    const deleteCategory = () => {
      DeleteCategory({ categoryId: deletedId.value })
        .then(response => {
          root.$message({
            showClose: true,
            message: response.data.message,
            type: "success"
          });
          // 更新列表
          const newList = category.items.filter(x => x.id !== deletedId.value);
          if (newList.length >= 0) {
            category.items = newList;
          }
        })
        .catch(error => {
          console.log(error);
        });
    };
    // 删除一级分类确认
    const deleteCategoryConfirm = categoryID => {
      deletedId.value = categoryID;
      confirm({
        content: "是否删除当前数据？",
        tip: "警告",
        fn: deleteCategory,
        catchFn: () => {
          deletedId.value = "";
        }
      });
    };
    // 添加二级分类
    const addSecondCategory = params => {
      isCategoryFirst.value = false;
      isCategoryAdd.value = true;
      firstCategory.value = true;
      secondCategory.value = true;
      firstCategoryStatus.value = true;
      secondCategoryStatus.value = false;
      submitStatus.value = false;
      category.operateItem = params.data;
      formCategory.firstCategoryName = params.data.categoryName;
    };
    // 添加二级分类提交调用方法
    const addSecondCategoryMethod = () => {
      if (!formCategory.secondCategoryName) {
        root.$message({
          showClose: true,
          message: "二级分类名称不可为空！",
          type: "warning"
        });
        submitLoadingStatus.value = false;
        return false;
      }
      AddSecondCategory({
        parentId: category.operateItem.id,
        categoryName: formCategory.secondCategoryName
      })
        .then(response => {
          if (response.data.rescode === 0) {
            root.$message({
              showClose: true,
              message: response.data.message,
              type: "success"
            });
            // 添加成功 刷新分类列表
            getInfoCategoryAll();
            // 清除输入信息
            refs.categoryForm.resetFields();
            formCategory.firstCategoryName.value = "";
            formCategory.secondCategoryName.value = "";
            // 恢复相关输入和按钮原始状态
            secondCategory.value = true;
            firstCategoryStatus.value = true;
            secondCategoryStatus.value = true;
            submitStatus.value = true;
          } else {
            root.$message({
              showClose: true,
              message: response.data.message,
              type: "error"
            });
          }
          submitLoadingStatus.value = false;
        })
        .catch(error => {
          console.log(error);
          submitLoadingStatus.value = false;
          // 清除输入信息
          refs.categoryForm.resetFields();
          formCategory.firstCategoryName.value = "";
          formCategory.secondCategoryName.value = "";
          // 恢复相关输入和按钮原始状态
          secondCategory.value = true;
          firstCategoryStatus.value = true;
          secondCategoryStatus.value = true;
          submitStatus.value = true;
        });
    };
    // 添加分类提交
    const submit = () => {
      submitLoadingStatus.value = true;
      if (isCategoryFirst && isCategoryAdd) {
        // 添加一级分类
        addFirstCategoryMethod();
      } else if (isCategoryFirst && !isCategoryAdd) {
        // 编辑一级分类
        editFirstCategoryMethod();
      } else {
        // 添加二级分类
        addSecondCategoryMethod();
      }
    };

    /**
     * 生命周期
     * 挂载完成时执行（页面DOM元素完成时，实例完成）
     */
    onMounted(() => {
      getInfoCategoryAll();
    });

    // watch
    watch(
      () => categoryItems.item,
      value => {
        category.item = value;
      }
    );

    return {
      firstCategory,
      secondCategory,
      submitLoadingStatus,
      firstCategoryStatus,
      secondCategoryStatus,
      submitStatus,
      formCategory,
      category,
      addFirstCategory,
      editFirstCategory,
      addSecondCategory,
      deleteCategoryConfirm,
      submit
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";
.category-wrap {
  div:first-child {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 20px;
    }
  }
}

.menu-title {
  line-height: 44px;
  background-color: #f3f3f3;
  padding-left: 22px;
}

.category {
  position: relative;
  line-height: 44px;
  &:before {
    content: "";
    position: absolute;
    top: 0px;
    bottom: 0;
    left: 22px;
    width: 32px;
    border-left: 1px dotted #000;
  }
  h4 {
    position: relative;
    padding-left: 40px;
  }
  svg {
    position: absolute;
    left: 14px;
    top: 15px;
    background-color: #fff;
    font-size: 17px;
  }
  li {
    position: relative;
    padding-left: 36px;
    margin-left: 24px;
    &:before {
      content: "";
      position: absolute;
      top: 22px;
      left: 0;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    @include webkit(transition, all 0.5s ease 0s);
    &:hover {
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
}

.button-group {
  display: none;
  position: absolute;
  button {
    font-size: 12px;
  }
  z-index: 2;
  right: 11px;
  top: -1px;
}

.form-wrap {
  padding-top: 26px;
  padding-bottom: 26px;
  width: 410px;
}

.hr-style {
  width: calc(100%+60px);
  margin-left: -30px;
  border: none;
  margin-top: 30px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e9e9e9;
}
</style>
