$(function () {
  // 变量声明
  let current_page_hot_lesson = 1;

  bindEvents();
  loadData();

  /**
   * 事件绑定
   */
  function bindEvents() {
    // 推荐课程--tab 切换
    $('#recommendedCourseTab a').on('click', function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    // 推荐课程--热门课程分页
    $('#recommendedCourseTabPane1').on(
      'click',
      '.hot-lesson-pagination a',
      function (e) {
        e.preventDefault();
        $(this).tab('show');
      }
    );
  }

  /**
   * 加载数据
   */
  function loadData() {
    // 获取选课中心标签
    getSelectProductTag();
    // 获取推荐课
    getRecommandStudy();
  }

  /**
   * 获取选课中心标签
   */
  function getSelectProductTag() {
    $.post(`${BASE_URL}/product/selectProduct`, function (res) {
      const { code, data } = res || {};
      if (code == 200) {
        console.log(data, 'selectProduct');
        $('#header .select-lesson-center .c').html(
          template('selectProductCenterTmp', {
            ...data,
          })
        );
      }
    });
  }

  /**
   * 获取推荐课
   */
  function getRecommandStudy() {
    $.post(`${BASE_URL}/product/recommandStudy`, function (res) {
      const { code, data } = res || {};
      if (code == 200) {
        // console.log(data, 'recommandStudy');
        $('#recommendedCourseTabPane1 .c').html(
          template('recommandStudyTmp', {
            ...data,
          })
        );
      }
    });
  }
});
