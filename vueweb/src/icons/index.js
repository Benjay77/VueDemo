import Vue from "vue";
import SvgIcon from "./SvgIcon";

Vue.component("svg-icon", SvgIcon);

/** require.context：获取指定目录下所有符合条件的文件
 * 第一个参数：目录
 * 第二个参数：是否遍历子目录
 * 第三个参数：定义遍历文件规则 获取的文件后缀名
 */
const req = require.context("./svg", false, /\.svg$/); // 正则里面表示结尾
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);
