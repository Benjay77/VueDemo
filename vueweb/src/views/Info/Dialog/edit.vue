<template>
  <el-dialog
    title="修改"
    :visible.sync="variableCollections.dialogInfoFlag"
    width="580px"
    @opened="openDialog"
    @close="cancel"
  >
    <el-form ref="addInfoForm" :model="variableCollections.form">
      <el-form-item
        label="分类："
        :label-width="variableCollections.formLabelWidth"
        prop="categoryId"
      >
        <el-select
          v-model="variableCollections.form.categoryId"
          placeholder="请选择分类"
        >
          <el-option
            v-for="item in variableCollections.categoryOptions.Items"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="标题："
        :label-width="variableCollections.formLabelWidth"
        prop="title"
      >
        <el-input
          v-model="variableCollections.form.title"
          placehoder="请输入标题"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="概况："
        :label-width="variableCollections.formLabelWidth"
        prop="content"
      >
        <el-input
          v-model="variableCollections.form.content"
          type="textarea"
          placehoder="请输入内容"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">
        取消
      </el-button>
      <el-button
        type="danger"
        :loading="variableCollections.submitLoadingStatus"
        @click="submit"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { GetInfoList, EditInfo } from "@/api/news";
import { watch, reactive } from "@vue/composition-api";
export default {
  name: "DialogInfoEdit",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    categoryItems: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: ""
    }
  },
  setup(props, { emit, root, refs }) {
    const variableCollections = reactive({
      dialogInfoFlag: false, // 是否打开弹窗
      formLabelWidth: "70px", // 表单标签宽度
      form: {
        categoryId: "",
        title: "",
        content: ""
      }, // 表单数据
      // 分类绑定模型
      categoryOptions: {
        items: []
      },
      // 确认按钮状态
      submitLoadingStatus: false
    });
    // watch 监视父组件传入的值props
    watch(() => (variableCollections.dialogInfoFlag.value = props.flag));
    const openDialog = () => {
      variableCollections.categoryOptions.items = props.categoryItems;
    };
    const getInfoDetail = () => {
      const requestData = reactive({
        pageNumber: 1,
        pageSize: 1,
        id: props.id
      });
      GetInfoList(requestData)
        .then(response => {
          if (response.data.resCode !== 0) {
            root.$message({
              showClose: true,
              message: response.data.message,
              type: "error"
            });
          } else {
            variableCollections.form.categoryId =
              response.data.data.data[0].categoryId;
            variableCollections.form.title = response.data.data.data[0].title;
            variableCollections.form.content =
              response.data.data.data[0].content;
          }
        })
        .catch(error => {
          console.log(error);
        });
    };
    // 确定
    const submit = () => {
      variableCollections.submitLoadingStatus.value = true;
      if (!variableCollections.form.category) {
        root.$message({
          showClose: true,
          message: "分类不可为空！",
          type: "warning"
        });
        variableCollections.submitLoadingStatus.value = false;
        return false;
      }
      if (!variableCollections.form.title) {
        root.$message({
          showClose: true,
          message: "标题不可为空！",
          type: "warning"
        });
        variableCollections.submitLoadingStatus.value = false;
        return false;
      }
      if (!variableCollections.form.content) {
        root.$message({
          showClose: true,
          message: "内容不可为空！",
          type: "warning"
        });
        variableCollections.submitLoadingStatus.value = false;
        return false;
      }
      const requestData = reactive({
        id: props.id,
        categoryId: variableCollections.form.categoryId,
        title: variableCollections.form.title,
        content: variableCollections.form.content
      });
      EditInfo(requestData)
        .then(response => {
          if (response.data.rescode === 0) {
            root.$message({
              showClose: true,
              message: response.data.message,
              type: "success"
            });
            refs.addInfoForm.resetFields();
            // 刷新列表数据
            // 1.直接刷新接口
            emit("updateInfoList");
            // 2.使用ID更新对应数据
          } else {
            root.$message({
              showClose: true,
              message: response.data.message,
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
      variableCollections.submitLoadingStatus.value = false;
      variableCollections.dialogInfoFlag.value = false;
      // 回调时有逻辑处理则不可用修饰器sync 反之则可以
      emit("update:flag", false);
    };
    // 取消
    const cancel = () => {
      variableCollections.dialogInfoFlag.value = false;
      variableCollections.submitLoadingStatus.value = false;
      refs.addInfoForm.resetFields();
      // 回调时有逻辑处理则不可用修饰器sync 反之则可以
      emit("update:flag", false);
    };

    return {
      variableCollections,
      openDialog,
      getInfoDetail,
      submit,
      cancel
    };
  }
};
</script>

<style></style>
