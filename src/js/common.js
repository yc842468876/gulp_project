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
    // 获取选课中心--推荐课
    getPosterCourses();
  }

  /**
   * 获取选课中心标签
   */
  function getSelectProductTag() {
    $.post(`${BASE_URL}/product/selectProduct`, function (res) {
      const { code, data } = res || {};
      if (code == 200) {
        // console.log(data, 'selectProduct');
        $('#header .select-lesson-center .categorys').html(
          template('selectProductCenterTmp', {
            ...data,
          })
        );
      }
    });
  }
});

/**
 * 获取选课中心--推荐课
 */
function getPosterCourses() {
  const postData = {
    count: 6,
    courseType: 'recommand',
  };
  $.post(
    `${BASE_URL}/product/getPosterCourses`,
    JSON.stringify(postData),
    function (res) {
      const { code, data } = res || {};
      // console.log(data);
      if (code == 200) {
        $('#header .select-lesson-center .recommend-list').html(
          template('selectProductRecommand', {
            ...data,
          })
        );
      }
    }
  );
}

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

/**
 * ajax 全局配置
 */
$.ajaxSetup({
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 获取 url 传参
 * @param {String} name 字段名（非必填）
 * @returns 整个params对象 | 单个字段值
 */
$.getUrlParam = function (name) {
  var obj = {};
  var url = window.location.href; //获取url，汉字部分是编码
  var arr = decodeURI(url).split('?')[1]
    ? decodeURI(url).split('?')[1].split('&')
    : []; // 解码，并以？ 和 & 符号进行分割
  //遍历数组
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i].split('=')[0]] = unescape(arr[i].split('=')[1]);
  }
  if (name) return obj[name] || null;
  return obj;
};
