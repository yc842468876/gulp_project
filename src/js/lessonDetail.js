$(function () {
  initData(); // 初始化数据
  bindEvents(); // 事件绑定
  loadData(); // 加载数据

  /**
   * 初始化数据
   */
  function initData() {}

  /**
   * 事件绑定
   */
  function bindEvents() {
    // 表单提交
    $('#form1').on('submit', function (e) {
      e.preventDefault();
      const formdata = $(this).serializeObject();
      alert('您已提交成功！\n' + JSON.stringify(formdata));
    });
  }

  /**
   * 加载数据
   */
  function loadData() {
    // 获取产品详情信息
    getProductDetail();
  }

  /**
   * 获取产品详情信息
   */
  function getProductDetail() {
    const { productId } = $.getUrlParam();
    const postData = {
      productId,
    };

    $.post(
      `${BASE_URL}/product/getProductDetail`,
      JSON.stringify(postData),
      function (res) {
        const { code, data } = res;
        // console.log(data);
        if (code == 200) {
          // 富文本框的空p标签，清空为 null
          if (data.detail.courseFeatuer === '<p></p>')
            data.detail.courseFeatuer = null;
          if (data.detail.courseProfit === '<p></p>')
            data.detail.courseProfit = null;
          if (data.detail.keysourseOpinion === '<p></p>')
            data.detail.keysourseOpinion = null;
          // 面包屑导航
          $('#breadNav').html(
            template('breadNavTmp', {
              ...data,
            })
          );
          // 课程详情
          $('#courseInfo').html(
            template('courseInfoTmp', {
              ...data,
            })
          );
          // 课程详情（更多）
          $('#courseMoreInfo').html(
            template('courseMoreInfoTmp', {
              ...data,
            })
          );
        }
      }
    );
  }
});
