$(function () {
  bindEvents(); // 事件绑定
  loadData(); // 加载数据

  /**
   * 事件绑定
   */
  function bindEvents() {
    // 推荐课程--tab 切换
    $('#recommendedCourseTab a[data-toggle="pill"]').on(
      'shown.bs.tab',
      function (e) {
        // 更改底部查看更多链接地址及文本
        const { moreLinkLable, moreLink } = $(this).data();
        $('.go-select-lesson-center .btn')
          .attr('href', moreLink)
          .html(`${moreLinkLable} <i class="fa fa-long-arrow-right"></i>`);
      }
    );
  }

  /**
   * 加载数据
   */
  function loadData() {
    // 获取推荐课
    getRecommandStudy();
  }

  /**
   * 获取推荐课
   */
  function getRecommandStudy() {
    $.post(`${BASE_URL}/product/recommandStudy`, function (res) {
      const { code, data } = res || {};
      if (code == 200) {
        // console.log(data, 'recommandStudy');
        $('#recommendedCourseTabPane1').html(
          template('recommandStudyTmp1', {
            ...data,
          })
        );

        $('.high-quality-lessons .tab-c-r').html(
          template('recommandStudyHotTmp', {
            ...data,
          })
        );
      }
    });
  }
});
