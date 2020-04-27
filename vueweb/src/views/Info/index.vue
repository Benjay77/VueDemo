<template>
  <div>
    <el-row :gutter="14">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for="">分类：</label>
          <div class="wrap-content">
            <el-select
              v-model="categoryValue"
              placeholder="请选择"
              style="width:100%;"
            >
              <el-option
                v-for="item in options.category"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="label-wrap date">
          <label for="">日期：&nbsp;&nbsp;</label>
          <div class="wrap-content">
            <el-date-picker
              v-model="dateValue"
              type="datetimerange"
              align="right"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
              style="width:100%;"
            >
            </el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="label-wrap keyword">
          <label for="">关键字：&nbsp;&nbsp;</label>
          <div class="wrap-content">
            <el-select v-model="searchKey" placeholder="请选择">
              <el-option
                v-for="item in searchOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <el-input
          v-model="searchKeyWork"
          placeholder="请输入内容"
          style="width:100%;"
        ></el-input>
      </el-col>
      <el-col :span="2">
        <el-button
          type="danger"
          size="small"
          style="width:100%;"
          @click="getInfoList"
        >
          搜索
        </el-button>
      </el-col>
      <el-col :span="3">
        &nbsp;
      </el-col>
      <el-col :span="2">
        <el-button
          size="small"
          type="danger"
          class="pull-right"
          style="width:100%;"
          @click="dialogInfo = true"
        >
          新增
        </el-button>
      </el-col>
    </el-row>

    <div class="block-space-30"></div>

    <!--表格-->
    <el-table
      v-loading="loadingTable"
      :data="tableData.infoList"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- 自定义表格未获取到数据样式 -->
      <!-- <template slot="empty">
        <div>没有获取到数据</div>
      </template> -->

      <el-table-column type="selection" width="45" />
      <el-table-column prop="title" label="标题" width="380" />
      <el-table-column
        prop="categoryId"
        label="分类"
        :formatter="toFormatterCategory"
        width="180"
      />
      <el-table-column
        prop="createDate"
        label="日期"
        :formatter="toFormatterCreateDate"
        width="237"
      />
      <el-table-column prop="user" label="管理人" width="115" />
      <el-table-column label="操作">
        // 表格里需要复杂的html 使用template scope 存储数据
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="editInfo(scope.row.id)"
            @updateInfoList="getInfoList"
          >
            编辑
          </el-button>
          <el-button size="mini" type="success">
            编辑详情
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteItem(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block-space-30"></div>

    <!--底部分页 批量删除-->
    <el-row>
      <el-col :span="12">
        <el-button size="meduim" @click="deleteAll">
          批量删除
        </el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
          background
          class="pull-right"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <!--新增弹窗-->
    <DialogInfo :flag.sync="dialogInfo" :categoryItems="options.category" />
    <!--修改弹窗-->
    <DialogEditInfo
      :id="infoId"
      :flag.sync="dialogInfoEdit"
      :categoryItems="options.category"
    />
  </div>
</template>

<script>
import { global } from "@/utils/global";
import DialogInfo from "./Dialog/info";
import DialogEditInfo from "./Dialog/edit";
import { reactive, ref, onMounted } from "@vue/composition-api";
import { GetInfoList, DeleteInfo } from "@/api/news";
import { timestampToTime } from "@/utils/common";
export default {
  name: "InfoIndex",
  components: {
    DialogInfo,
    DialogEditInfo
  },
  setup(props, { root }) {
    const { confirm } = global();
    // 分类绑定模型
    const options = reactive({
      category: []
    });
    // 选择的分类
    const categoryValue = ref("");
    // 日期绑定模型
    const dateValue = ref("");
    // 关键字绑定模型
    const searchOptions = reactive([
      {
        value: "id",
        label: "ID"
      },
      {
        value: "title",
        label: "标题"
      }
    ]);
    // 选择的关键字
    const searchKey = ref("id");
    // 输入的关键字
    const searchKeyWork = ref("");
    // 新增弹窗
    const dialogInfo = ref(true);
    // 修改弹窗
    const dialogInfoEdit = ref(true);
    // 选择的信息ID
    const infoId = ref("");
    // 列表加载
    const loadingTable = ref(false);
    // 选择删除的Id
    const deleteInfoId = ref("");
    // 总数
    const total = ref(0);
    // 分页模型
    const page = reactive({
      pageNumber: 1,
      pageSize: 10
    });
    // 表格绑定模型
    const tableData = reactive(
      {
        infoList: []
      }
      // [{
      //   date: "2016-05-02",
      //   user: "王小虎",
      //   title: "上海市普陀区金沙江路 1518 弄",
      //   category: "国内信息"
      // },
      // {
      //   date: "2016-05-02",
      //   user: "王小虎",
      //   title: "上海市普陀区金沙江路 1518 弄",
      //   category: "国内信息"
      // },
      // {
      //   date: "2016-05-02",
      //   user: "王小虎",
      //   title: "上海市普陀区金沙江路 1518 弄",
      //   category: "国内信息"
      // },
      // {
      //   date: "2016-05-02",
      //   user: "王小虎",
      //   title: "上海市普陀区金沙江路 1518 弄",
      //   category: "国内信息"
      // }]
    );
    // 获取分类
    const getInfoCategory = () => {
      root.$store.dispatch("common/getInfoCategory").then(response => {
        options.category = response;
      });
    };
    // 格式化搜索条件
    const formatData = () => {
      const requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      // 分类ID
      if (categoryValue.value) {
        requestData.categoryId = categoryValue.value;
      }
      // 日期
      if (dateValue.value.length > 0) {
        requestData.startTime = dateValue.value[0];
        requestData.endTime = dateValue.value[1];
      }
      // 关键字
      if (searchKeyWork.value) {
        requestData[searchKey.value] = searchKeyWork.value;
      }
      return requestData;
    };
    // 获取列表
    const getInfoList = () => {
      loadingTable.value = true;
      const requestData = formatData();
      GetInfoList(requestData)
        .then(response => {
          tableData.infoList = response.data.data.data;
          total.value = response.data.data.total;
          loadingTable.value = false;
        })
        .catch(error => {
          console.log(error);
          loadingTable.value = false;
        });
    };
    // 确认删除
    const confirmDelete = () => {
      DeleteInfo({ id: deleteInfoId.value }).then(response => {
        if (response.data.resCode === 0) {
          root.$message({
            showClose: true,
            message: response.data.message,
            type: "success"
          });
        }
        deleteInfoId.value = "";
        getInfoList();
      });
    };
    // 删除一条选择的数据
    const deleteItem = id => {
      deleteInfoId.value = [id];
      confirm({
        content: "是否删除当前数据？",
        tip: "警告",
        fn: confirmDelete
      });
    };
    // 批量删除
    const deleteAll = () => {
      if (!deleteInfoId.value || deleteInfoId.value.length === 0) {
        root.$message({
          message: "请选择要删除的数据！！",
          type: "error"
        });
        return false;
      }
      confirm({
        content: "是否删除所选择的数据？",
        fn: confirmDelete,
        tip: "警告"
      });
    };
    // 分页每页数修改触发
    const handleSizeChange = val => {
      page.pageSize = val;
    };
    // 分页页数修改触发
    const handleCurrentChange = val => {
      page.pageNumber = val;
      getInfoList();
    };
    // 格式化分类数据(row, column, cellValue, index)
    const toFormatterCategory = row => {
      const categoryData = options.category.filter(
        item => item.id === row.categoryId
      )[0];
      return categoryData.categoryname;
    };
    // 格式化日期数据(row, column, cellValue, index)
    const toFormatterCreateDate = row => {
      timestampToTime(row.createDate);
    };
    // 批量删除
    const handleSelectionChange = val => {
      const id = val.map(x => x.id);
      deleteInfoId.value = id;
    };
    // 编辑表格数据
    const editInfo = id => {
      infoId.value = id;
      dialogInfoEdit.value = true;
    };

    /**
     * 生命周期
     * 挂载完成时执行（页面DOM元素完成时，实例完成）
     */
    onMounted(() => {
      getInfoCategory();
      getInfoList();
    });

    return {
      options,
      searchOptions,
      searchKey,
      searchKeyWork,
      categoryValue,
      dateValue,
      tableData,
      loadingTable,
      total,
      toFormatterCategory,
      toFormatterCreateDate,
      handleSelectionChange,
      deleteItem,
      deleteAll,
      handleSizeChange,
      handleCurrentChange,
      getInfoList,
      dialogInfo,
      dialogInfoEdit,
      editInfo,
      infoId
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(right, 93, 40);
  }
  &.keyword {
    @include labelDom(right, 99, 40);
  }
}
</style>
