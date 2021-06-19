$(function () {
  let lesson_type = 'GENERAL'; // 选课类型--默认“综合”
  let filter_month = null; // 筛选月份
  let course_category = null; // 课程类别
  let product_direction = null; // 专业方向
  let professional_certify = null; // 职业认证
  let filter_city = null; // 筛选城市
  let low_price = null; // 价格区间--开始
  let up_price = null; // 价格区间--闭合
  let key_words = ''; // 关键词搜索
  let pageSize = 5; // 一页条数
  let currentPage = 1; // 页码
  let first_tag = []; // 一级分类标签--筛选条件
  let second_tag = []; // 二级分类标签--筛选条件

  initData(); // 初始化数据
  bindEvents(); // 事件绑定
  loadData(); // 加载数据

  /**
   * 初始化数据
   */
  function initData() {
    // 根据页面路由传参--初始化页面 tab 和 滚动至选课模块
    const { lessonType, firstTag, secondTag, supplyTag } = $.getUrlParam();
    if (lessonType) {
      $(`#lessonType a[href="#${lessonType}"]`)
        .parent()
        .addClass('active')
        .siblings()
        .removeClass('active');
      lesson_type = lessonType;
    }
    if (lessonType || firstTag || secondTag || supplyTag) {
      $('html, body').scrollTop($('.search-lessons').offset().top - 109);
    }
  }

  /**
   * 事件绑定
   */
  function bindEvents() {
    // 切换类型监听
    $('#lessonType a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      const { type } = $(this).data();
      lesson_type = type;
      handleTabChange();
    });
    // 监听筛选条件点击事件--月份（多选）
    $('#filterMonth').on('click', '.tag', function () {
      const { tag } = $(this).data();
      changeTagValue({
        id: 'filterMonth',
        tag: tag,
        cb: queryData,
      });
    });
    // 监听筛选条件点击事件--课程类型（多选）
    $('#courseCategory')
      .on('click', '.tag', function () {
        const { tag } = $(this).data();
        changeTagValue({
          id: 'courseCategory',
          tag: tag,
          cb: queryData,
        });
      })
      .on('click', '.more', function () {
        const isExpand = $(this).text().includes('更多');
        const htmlStr = isExpand
          ? `收起&nbsp;<i class="glyphicon glyphicon-menu-up"></i>`
          : `更多&nbsp;<i class="glyphicon glyphicon-menu-down"></i>`;
        $(this).html(htmlStr).siblings('.tags').toggleClass('h24');
      });
    // 监听筛选条件点击事件--专业方向（多选）
    $('#productDirection')
      .on('click', '.tag', function () {
        const { tag } = $(this).data();
        changeTagValue({
          id: 'productDirection',
          tag: tag,
          cb: queryData,
        });
      })
      .on('click', '.more', function () {
        const isExpand = $(this).text().includes('更多');
        const htmlStr = isExpand
          ? `收起&nbsp;<i class="glyphicon glyphicon-menu-up"></i>`
          : `更多&nbsp;<i class="glyphicon glyphicon-menu-down"></i>`;
        $(this).html(htmlStr).siblings('.tags').toggleClass('h24');
      });
    // 监听筛选条件点击事件--职业认证（多选）
    $('#professionalCertify')
      .on('click', '.tag', function () {
        const { tag } = $(this).data();
        changeTagValue({
          id: 'professionalCertify',
          tag: tag,
          cb: queryData,
        });
      })
      .on('click', '.more', function () {
        const isExpand = $(this).text().includes('更多');
        const htmlStr = isExpand
          ? `收起&nbsp;<i class="glyphicon glyphicon-menu-up"></i>`
          : `更多&nbsp;<i class="glyphicon glyphicon-menu-down"></i>`;
        $(this).html(htmlStr).siblings('.tags').toggleClass('h24');
      });
    // 监听筛选条件点击事件--城市（多选）
    $('#filterCity').on('click', '.tag', function () {
      const { tag } = $(this).data();
      changeTagValue({
        id: 'filterCity',
        tag: tag,
        cb: queryData,
      });
    });
    // 监听筛选条件点击事件--价格区间（单选）
    $('#filterPrice').on('click', '.tag', function () {
      const { tag } = $(this).data();
      changeTagValue({
        id: 'filterPrice',
        tag: tag,
        cb: queryData,
        type: 'single',
      });
    });
    // 监听关键词搜索
    $('.search-lessons .search-inp .btn').on('click', function () {
      const inpValue = $('.search-lessons .search-inp .form-control').val();
      key_words = inpValue;
      currentPage = 1;
      queryData();
    });
    // 搜索课程的时间表展开与折叠
    $('.search-lessons .search-content').on('click', '.addTr', function () {
      const isExpand = $(this).text().includes('更多');
      const htmlStr = isExpand
        ? `收起&nbsp;<i class="glyphicon glyphicon-menu-up"></i>`
        : `展开更多&nbsp;<i class="glyphicon glyphicon-menu-down"></i>`;
      if (isExpand) {
        $(this).html(htmlStr).siblings('table').find('tr.hide-part').show();
      } else {
        $(this).html(htmlStr).siblings('table').find('tr.hide-part').hide();
      }
    });
  }

  /**
   * 加载数据
   */
  function loadData() {
    getHotGoodCourses(); // 查询热门好课
    getProductQueryLabel(); // 获取产品标签
    getBestSellingCourses(); // 加载畅销网课
  }

  /**
   * 获取产品标签
   */
  function getProductQueryLabel() {
    $.post(`${BASE_URL}/product/getProductQueryLabel`, function (res) {
      const { code, data } = res;
      // console.log(data);
      if (code == 200) {
        // 缓存标签值
        first_tag = data.first || [];
        second_tag = data.second || [];
        // 生成职业认证标签
        $('#professionalCertify .tags').html(
          template('professionalCertifyTmp', {
            supply_tag: data.supply || [],
          })
        );
        const { firstTag, secondTag, supplyTag } = $.getUrlParam();
        handleTabChange({ firstTag, secondTag, supplyTag });
      }
    });
  }

  /**
   * 查询热门好课
   */
  function getHotGoodCourses() {
    const postData = {
      count: 4,
      courseType: 'hot',
    };
    $.post(
      `${BASE_URL}/product/getPosterCourses`,
      JSON.stringify(postData),
      function (res) {
        const { code, data } = res || {};
        // console.log(data);
        if (code == 200) {
          $('#hotGoodCourses ul').html(
            template('hotGoodCoursesTmp', {
              ...data,
            })
          );
        }
      }
    );
  }

  /**
   * 加载畅销网课
   */
  function getBestSellingCourses() {
    const postData = {
      count: 6,
      courseType: 'best',
    };
    $.post(
      `${BASE_URL}/product/getPosterCourses`,
      JSON.stringify(postData),
      function (res) {
        const { code, data } = res || {};
        // console.log(data);
        if (code == 200) {
          $('#bestSellingCourse ul').html(
            template('bestSellingCourseTmp', {
              ...data,
            })
          );
        }
      }
    );
  }

  /**
   * 设置分页组件
   * @param pageCurrent 当前所在页
   * @param pageSum 总页数
   * @param callback 调用ajax
   */
  function setPage(pageCurrent, pageSum, callback) {
    $('#coursePaginator').bootstrapPaginator({
      bootstrapMajorVersion: 3,
      currentPage: pageCurrent,
      totalPages: pageSum,
      onPageChanged: function (event, oldPage, newPage) {
        currentPage = newPage;
        // 是翻页--自动滚动至当前列表上部
        $('html, body').scrollTop($('.search-lessons').offset().top - 109);
        callback && callback();
      },
      tooltipTitles: function (type, page, current) {
        let tip = '';
        switch (type) {
          case 'page':
            tip = `第${page}页`;
            break;
          case 'prev':
            tip = '上一页';
            break;
          case 'next':
            tip = '下一页';
            break;
          case 'first':
            tip = '首页';
            break;
          case 'last':
            tip = '末页';
            break;
          default:
            break;
        }
        return tip;
      },
    });
  }

  /**
   * 查询数据
   * @param {*} postData 接口传参
   */
  function queryData() {
    const postData = {
      teachingForm: lesson_type !== 'GENERAL' ? lesson_type : 'ALL',
      startMonth: filter_month,
      firstClassList: course_category,
      secClassList: product_direction,
      supplyList: professional_certify ? professional_certify.split(',') : [],
      city: filter_city,
      lowPrice: low_price,
      upPrice: up_price,
      keyWord: key_words,
      pageIndex: currentPage,
      pageSize: pageSize,
    };
    // console.log(postData);
    $.post(
      `${BASE_URL}/product/getProductQueryList`,
      JSON.stringify(postData),
      function (res) {
        const { code, data } = res;
        // console.log(data);
        if (code == 200) {
          $('#courseList').html(
            template('courseListTmp', {
              list: data.list || [],
              lessonType: lesson_type,
            })
          );
          // count 为 0 时，分页组件报错处理
          if (data.count) {
            setPage(currentPage, Math.ceil(data.count / pageSize), queryData);
          } else {
            $('#coursePaginator').html(null);
          }
        }
      }
    );
  }

  /**
   * 切换 tab 事件
   * @param {string} initTagObj 初始标签值--页面路由传参
   * @param {Object} initTagObj 初始标签值--页面路由传参
   */
  function handleTabChange(initTagObj) {
    pageSize = lesson_type !== 'ONLINE' ? 5 : 15;
    // 过滤一二级分类标签 且 显示可选标签类型
    switch (lesson_type) {
      case 'GENERAL':
        $('#filterMonth').show();
        $('#courseCategory').show();
        $('#productDirection').show();
        $('#professionalCertify').hide();
        $('#filterCity').show();
        $('#filterPrice').show();
        $('#courseCategory .tags').html(
          template('courseCategoryTmp', {
            first_tag,
          })
        );
        $('#productDirection .tags').html(
          template('productDirectionTmp', {
            second_tag,
          })
        );
        break;
      case 'FACE':
        $('#filterMonth').show();
        $('#courseCategory').show();
        $('#productDirection').show();
        $('#professionalCertify').hide();
        $('#filterCity').show();
        $('#filterPrice').show();
        // 加载一二级标签数据
        $('#courseCategory .tags').html(
          template('courseCategoryTmp', {
            first_tag: first_tag.filter(
              (v) => v.labelType && v.labelType.includes('FACE')
            ),
          })
        );
        $('#productDirection .tags').html(
          template('productDirectionTmp', {
            second_tag: second_tag.filter(
              (v) => v.labelType && v.labelType.includes('FACE')
            ),
          })
        );
        break;
      case 'ONLINE':
        $('#filterMonth').hide();
        $('#courseCategory').show();
        $('#productDirection').show();
        $('#professionalCertify').hide();
        $('#filterCity').hide();
        $('#filterPrice').show();
        // 加载一二级标签数据
        $('#courseCategory .tags').html(
          template('courseCategoryTmp', {
            first_tag: first_tag.filter(
              (v) => v.labelType && v.labelType.includes('ONLINE')
            ),
          })
        );
        $('#productDirection .tags').html(
          template('productDirectionTmp', {
            second_tag: second_tag.filter(
              (v) => v.labelType && v.labelType.includes('ONLINE')
            ),
          })
        );
        break;
      case 'PRO':
        $('#filterMonth').show();
        $('#courseCategory').hide();
        $('#productDirection').hide();
        $('#professionalCertify').show();
        $('#filterCity').show();
        $('#filterPrice').show();
        break;
      default:
        break;
    }
    // 初始化标签
    initTag(initTagObj || {});
    queryData();
  }

  /**
   * 初始化标签选值
   * @param {String} firstTag 课程类型
   * @param {String} secondTag 专业方向
   * @param {String} supplyTag 职业认证
   */
  function initTag({ firstTag, secondTag, supplyTag }) {
    changeTagValue({ id: 'filterMonth', tag: 'all', initTab: true });
    changeTagValue({
      id: 'courseCategory',
      tag: firstTag || 'all',
      initTab: true,
    });
    // 如果初始选中，则展开该类标签--一级分类
    if (firstTag) $('#courseCategory .more').trigger('click');
    changeTagValue({
      id: 'productDirection',
      tag: secondTag || 'all',
      initTab: true,
    });
    // 如果初始选中，则展开该类标签--二级分类
    if (secondTag) $('#productDirection .more').trigger('click');
    changeTagValue({
      id: 'professionalCertify',
      tag: supplyTag || 'all',
      initTab: true,
    });
    // 如果初始选中，则展开该类标签--供应商
    if (supplyTag) $('#professionalCertify .more').trigger('click');
    changeTagValue({ id: 'filterCity', tag: 'all', initTab: true });
    changeTagValue({
      id: 'filterPrice',
      tag: 'all',
      type: 'single',
      initTab: true,
    });
  }

  /**
   * 切换选中标签时，更新隐藏表单数据--做查询用
   * @param {String} id tag标签父id--必填
   * @param {String} tag tag标签值--必填
   * @param {Function} cb 回调函数，参数为form序列化数据
   * @param {String} type 类型（single | mutiple），默认为多选
   * @param {Boolean} initTab 初始化标签（标识），默认为 false
   * @returns null
   */
  function changeTagValue({ id, tag, cb, type = 'multiple', initTab = false }) {
    const container = $(`#${id}`); // 当前 field 容器
    const that = container.find(`.tag[data-tag="${tag}"]`); // 当前点击的标签
    const isAll = that.data('tag') === 'all'; // 是否点击 “全部”

    if (type === 'single') {
      const currentTag = container.find('.active').data('tag');
      // change 事件--已选全部点击无效（initTab除外，初始赋值用）
      if (tag === currentTag && !initTab) return;
      container.find('.tag').removeClass('active');
      that.addClass('active');
      const tagString = isAll ? '' : that.data('code');
      switch (id) {
        case 'filterPrice':
          low_price = tagString.split(',')[0] || null;
          up_price = tagString.split(',')[1] || null;
          break;
        default:
          break;
      }
    } else {
      let tagsArr = [];
      const tags = container.find('.tag').not('.all');
      // 切换是否选中
      !isAll && that.toggleClass('active');
      // 获取当前已选中标签
      tags.each(function () {
        if ($(this).hasClass('active')) tagsArr.push($(this).data('code'));
      });

      // 判断点击是否为全部按钮--其他控全部/全部清其他
      if (!isAll) {
        if (!tagsArr.length || tagsArr.length === tags.length) {
          container.find('.all').addClass('active');
        } else {
          container.find('.all').removeClass('active');
        }
      } else {
        // change 事件--已选全部点击无效（initTab除外，初始赋值用）
        if (!tagsArr.length && !initTab) return;
        container.find('.tag').removeClass('active');
        that.addClass('active');
        tagsArr = [];
      }
      const tagString = tagsArr.join(',');
      switch (id) {
        case 'filterMonth':
          filter_month = tagString || null;
          break;
        case 'courseCategory':
          course_category = tagString || null;
          break;
        case 'productDirection':
          product_direction = tagString || null;
          break;
        case 'professionalCertify':
          professional_certify = tagString || null;
          break;
        case 'filterCity':
          filter_city = tagString || null;
          break;
        default:
          break;
      }
    }

    // 切换选中标签--清空关键字和页码初始
    currentPage = 1;
    // 初始化关键词搜索
    key_words = '';
    $('.search-lessons .search-inp .form-control').val('');

    // 回调--查询课程用
    if (cb) {
      cb();
    }
  }
});
