<template>
  <div id="login">
    <div class="login-warp">
      <ul class="menu-tab">
        <li
          v-for="menuTab in menuTabs"
          :key="menuTab.id"
          :class="{ current: menuTab.IsClick }"
          @click="toggleMenu(menuTab)"
        >
          {{ menuTab.txt }}
        </li>
      </ul>
      <!--表单-->
      <el-form
        ref="loginForm"
        :model="ruleForm"
        status-icon
        :rules="rules"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="email" class="item-form">
          <label for="email">邮箱</label>
          <el-input
            id="email"
            v-model="ruleForm.email"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            id="password"
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
            maxlength="20"
            minlength="6"
          />
        </el-form-item>
        <!-- 1.手段：v-if是通过控制dom节点的存在与否来控制元素的显隐；v-show是通过设置DOM元素的display样式，
        block为显示，none为隐藏；
        2.编译过程：v-if切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；
        v-show只是简单的基于css切换；
        3.编译条件：v-if是惰性的，如果初始条件为假，则什么也不做；
        只有在条件第一次变为真时才开始局部编译（编译被缓存？编译被缓存后，然后再切换的时候进行局部卸载);
        v-show是在任何条件下（首次条件是否为真）都被编译，然后被缓存，而且DOM元素保留；
        4.性能消耗：v-if有更高的切换消耗；v-show有更高的初始渲染消耗；
         -->
        <el-form-item
          v-show="moduleMode === 'register'"
          prop="passwords"
          class="item-form"
        >
          <label for="passwords">重复密码</label>
          <el-input
            v-model="ruleForm.passwords"
            type="password"
            autocomplete="off"
            maxlength="20"
            minlength="6"
          />
        </el-form-item>
        <el-form-item prop="code" class="item-form">
          <label for="code">验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model="ruleForm.code" maxlength="6" minlength="6" />
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="btn-block"
                :disabled="codeButton.codeButtonStatus"
                @click="getSms()"
              >
                {{ codeButton.codeButtonText }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            class="login-btn btn-block"
            :disabled="submitButtonStatus"
            @click="submitForm('loginForm')"
          >
            {{ moduleMode === "login" ? "登录" : "注册" }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import 非default 使用{} default不能使用{}
import sha1 from "js-sha1";
import { GetSms, Register } from "@/api/login.js";
import { ref, reactive } from "@vue/composition-api"; // isRef, toRefs,onMounted
import {
  stripscript,
  checkEmail,
  checkPassword,
  checkCode
} from "@/utils/validate.js";
export default {
  name: "Login",
  setup(props, { refs, root }) {
    // vue 3.0API 放置2.0的数据 生命周期 自定义函数

    // 数据
    const menuTabs = reactive([
      {
        txt: "登录",
        IsClick: true,
        type: "login"
      },
      {
        txt: "注册",
        IsClick: false,
        type: "register"
      }
    ]); // 对象使用reactive申明

    // 模块 变量使用ref声明 取值用变量.value 判断使用 isRef 对象转换成变量使用toRef
    const moduleMode = ref("login");
    // 提交按钮可用标识
    const submitButtonStatus = ref(true);
    // 验证码按钮显示标识及文字
    const codeButton = reactive({
      codeButtonStatus: false,
      codeButtonText: "获取验证码"
    });
    // 定时器
    const timer = ref(null);
    // 表单
    const ruleForm = reactive({
      email: "",
      password: "",
      passwords: "",
      code: ""
    });

    // 验证邮箱
    const validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱！"));
      } else if (checkEmail(value)) {
        callback(new Error("请输入正确的邮箱！"));
      } else {
        callback();
      }
    };
    // 验证密码
    const validatePassword = (rule, value, callback) => {
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码！"));
      } else if (checkPassword(value)) {
        callback(new Error("密码应为6-20位小写字母、大写字母和数字的组合！"));
      } else {
        callback();
      }
    };
    // 验证重复密码
    const validatePasswords = (rule, value, callback) => {
      // 如果模块值为login, 直接通过
      if (moduleMode.value === "login") {
        callback();
      }
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === "") {
        callback(new Error("请输入重复密码！"));
      } else if (value !== ruleForm.password) {
        callback(new Error("重复密码与密码不同，请重新输入！"));
      } else {
        callback();
      }
    };
    // 验证验证码
    const validateCode = (rule, value, callback) => {
      ruleForm.code = stripscript(value);
      value = ruleForm.code;
      if (value === "") {
        return callback(new Error("请输入验证码！"));
      } else if (checkCode(value)) {
        return callback(new Error("验证码应为6位小写字母或数字！"));
      } else {
        callback();
      }
    };

    const rules = reactive({
      email: [
        {
          validator: validateEmail,
          trigger: "blur"
        }
      ],
      password: [
        {
          validator: validatePassword,
          trigger: "blur"
        }
      ],
      passwords: [
        {
          validator: validatePasswords,
          trigger: "blur"
        }
      ],
      code: [
        {
          validator: validateCode,
          trigger: "blur"
        }
      ]
    });

    /**
     * 声明函数
     */

    // 更新按钮状态及文字显示
    const updateButton = params => {
      codeButton.codeButtonText = params.text;
      codeButton.codeButtonStatus = params.status;
    };

    // 清除定时器
    const clearTimer = () => {
      if (timer.value !== null) {
        clearInterval(timer.value);
      }
    };

    // 重置输入及按钮状态并清除倒计时
    const clear = () => {
      refs.loginForm.resetFields();
      clearTimer();
      submitButtonStatus.value = true;
      updateButton({
        text: "获取验证码",
        status: false
      });
    };

    // 登录注册切换显示
    const toggleMenu = item => {
      menuTabs.forEach(a => {
        a.IsClick = false;
      });
      item.IsClick = true;
      moduleMode.value = item.type;
      // 重置功能
      clear();
    };

    // 倒计时
    const countDown = timesRun => {
      clearTimer();
      timer.value = setInterval(() => {
        codeButton.codeButtonText = `倒计时${timesRun}秒`;
        timesRun--;
        if (timesRun === 0) {
          clearTimer();
          updateButton({
            text: "重新发送",
            status: false
          });
        }
      }, 1000);
    };

    // 获取验证码
    const getSms = () => {
      if (!ruleForm.email) {
        root.$message.error("邮箱不可以为空！");
        return false;
      }
      if (checkEmail(ruleForm.email)) {
        root.$message.error("邮箱格式不正确！");
        return false;
      }
      updateButton({
        text: "发送中。。",
        status: true
      });

      const requestData = {
        username: ruleForm.email,
        module: moduleMode.value
      };
      GetSms(requestData)
        .then(response => {
          const responseData = response.data;
          root.$message({
            message: responseData.message,
            type: "success"
          });
          // 提交按钮启用
          submitButtonStatus.value = false;
          // 调用定时器
          countDown(60);
        })
        .catch(error => {
          console.log(error);
          updateButton({
            text: "获取验证码",
            status: false
          });
        });
      // 模拟接口延时请求
      // setTimeout(() => {}, 3000);
    };

    // 注册
    const register = () => {
      const requestData = {
        username: ruleForm.email,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
        module: moduleMode.value
      };
      Register(requestData)
        .then(response => {
          const responseData = response.data;
          root.$message({
            message: responseData.message,
            type: "success"
          });
          // 注册成功切换到登录页面
          toggleMenu(menuTabs[0]);
          // 提交按钮启用
          submitButtonStatus.value = false;
        })
        .catch(error => {
          console.log(error);
        });
    };

    // 登录
    const login = () => {
      const requestData = {
        username: ruleForm.email,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      root.$store
        .dispatch("app/login", requestData)
        .then(() => {
          // 登录成功跳转到控制台
          root.$router.push({
            name: "Console"
          });
        })
        .catch(error => {
          console.log(error);
        });
    };

    // 表单提交
    const submitForm = formName => {
      refs[formName].validate((valid, invalid) => {
        if (valid) {
          moduleMode.value === "login" ? login() : register();
        } else {
          // element-ui自带的表单验证 invalid返回验证有误的那一栏
          console.log(invalid);
          return false;
        }
      });
    };

    // 生命周期
    /**
     * onMounted(() => {
        Login();
        GetSms()
    });
    */

    return {
      menuTabs,
      moduleMode,
      submitButtonStatus,
      codeButton,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      getSms
    };
  }
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-warp {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: white;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: black;
  }
}
.login-form {
  margin-top: 29px;
  label {
    color: white;
    font-size: 14px;
    display: block;
    margin-bottom: 3px;
  }
}
.item-form {
  margin-bottom: 13px;
}
.login-btn {
  margin-top: 19px;
}
.btn-block {
  width: 100%;
  display: block;
}
</style>
