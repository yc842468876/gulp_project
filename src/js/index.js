$(function () {
  bindEvents(); // 事件绑定
  loadData(); // 加载数据
});

/**
 * 事件绑定
 */
function bindEvents() {
  // 推荐课程--tab 切换
  $('#recommendedCourseTab a').on('click', function (e) {
    e.preventDefault();
    $(this).tab('show');
    // 更改底部查看更多链接地址及文本
    const { moreLinkLable, moreLink } = $(this).data();
    $('.go-select-lesson-center .btn')
      .attr('href', moreLink)
      .html(`${moreLinkLable} <i class="fa fa-long-arrow-right"></i>`);
    console.log(moreLinkLable, moreLink);
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
      // console.log(data, 'selectProduct');
      $('#header .select-lesson-center .link-item-mask').html(
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
