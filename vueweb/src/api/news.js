import instance from "@/utils/request.js";

/** 添加一级分类
 * @method AddFirstCategory
 * @for news.js
 * @param {JSON} data 输入值
 * @return {JSON} 返回值
 */
export function AddFirstCategory(data) {
  return instance.request({
    method: "post",
    url: "/news/addFirstCategory/",
    data
  });
}

/** 添加二级分类
 * @method AddSecondCategory
 * @for news.js
 * @param {JSON} data 输入值
 * @return {JSON} 返回值
 */
export function AddSecondCategory(data) {
  return instance.request({
    method: "post",
    url: "/news/addChildrenCategory/",
    data
  });
}

/** 获取分类
 * @method GetCategory
 * @for news.js
 * @param {JSON} data 输入值
 * @return {JSON} 返回值
 */
export function GetCategory() {
  return instance.request({
    method: "post",
    url: "/news/getCategory/"
  });
}

/** 获取所有层级分类
 * @method GetCategoryAll
 * @for news.js
 * @param {JSON} data 输入值
 * @return {JSON} 返回值
 */
export function GetCategoryAll() {
  return instance.request({
    method: "post",
    url: "/news/getCategoryAll/"
  });
}

/** 删除分类
 * @method DeleteCategory
 * @for news.js
 * @param {string} data 输入值
 * @return {JSON} 返回值
 */
export function DeleteCategory(data) {
  return instance.request({
    method: "post",
    url: "/news/deleteCategory/",
    data
  });
}

/** 修改分类
 * @method EditCategory
 * @for news.js
 * @param {JSON} data 输入值
 * @return {JSON} 返回值
 */
export function EditCategory(data) {
  return instance.request({
    method: "post",
    url: "/news/editCategory/",
    data
  });
}

/** 添加信息
 * @method AddInfo
 * @for news.js
 * @param {JSON} data 输入值
 * @return {JSON} 返回值
 */
export function AddInfo(data) {
  return instance.request({
    method: "post",
    url: "/news/add/", // addInfo/",
    data
  });
}

/** 修改信息
 * @method EditInfo
 * @for news.js
 * @param {JSON} data 输入值
 * @return {JSON} 返回值
 */
export function EditInfo(data) {
  return instance.request({
    method: "post",
    url: "/news/editInfo/", // addInfo/",
    data
  });
}

/** 获取信息列表
 * @method GetInfoList
 * @for news.js
 * @param {JSON} data 输入值
 * @return {JSON} 返回值
 */
export function GetInfoList(data) {
  return instance.request({
    method: "post",
    url: "/news/getList/", // getInfoList/",
    data
  });
}

/** 删除信息
 * @method DeleteInfo
 * @for news.js
 * @param {JSON} data 输入值
 * @return {JSON} 返回值
 */
export function DeleteInfo(data) {
  return instance.request({
    method: "post",
    url: "/news/deleteInfo/",
    data
  });
}
