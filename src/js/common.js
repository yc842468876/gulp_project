// api 接口基础路径--测试
const BASE_URL = '/api';

// 页面公共部分 js
$(function () {
  bindEvents(); // 事件绑定
  loadData(); // 加载数据

  /**
   * 事件绑定
   */
  function bindEvents() {
    // 返回顶部按钮
    $(window).on('scroll', function () {
      if ($(this).scrollTop() > 300) {
        $('#return-top').show();
      } else {
        $('#return-top').hide();
      }
    });
  }

  /**
   * 加载数据
   */
  function loadData() {
    // 获取选课中心标签
    getSelectProductTag();
  }

  /**
   * 获取选课中心标签
   */
  function getSelectProductTag() {
    $.post(`${BASE_URL}/product/selectProduct`, function (res) {
      const { code, data } = res || {};
      if (code == 200) {
        // console.log(data, 'selectProduct');
        $('#header .select-lesson-center .link-item-mask').html(
          template('selectProductCenterTmp', {
            ...data,
          })
        );
      }
    });
  }
});

/**
 * 序列化表单数据方法
 * @returns {Object} formdata
 */
$.fn.serializeObject = function () {
  var ct = this.serializeArray();
  var obj = {};
  $.each(ct, function () {
    if (obj[this.name] !== undefined) {
      if (!obj[this.name].push) {
        obj[this.name] = [obj[this.name]];
      }
      obj[this.name].push(this.value || '');
    } else {
      obj[this.name] = this.value || '';
    }
  });
  return obj;
};
