$(function () {
  let lesson_type = 'generalLesson'; // 选课类型--默认“综合”
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

  initData(); // 初始化数据
  bindEvents(); // 事件绑定
  loadData(); // 加载数据

  /**
   * 初始化数据
   */
  function initData() {
    const { lessonType } = utils.getUrlParam();
    if (lessonType) {
      lesson_type = lessonType || lesson_type;
      $(`#lessonType a[href="#${lessonType}"]`).tab('show');
    }
    handleTabChange();
  }

  /**
   * 事件绑定
   */
  function bindEvents() {
    // 切换类型监听
    $('#lessonType a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      const { type } = $(this).data();
      handleTabChange(type);
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
        $(this).html(htmlStr);
        const autoHeight = $(this).siblings('.tags').find('ul').height();
        $(this)
          .siblings('.tags')
          .animate(
            {
              height: isExpand ? autoHeight : '24px',
            },
            300
          );
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
        $(this).html(htmlStr);
        const autoHeight = $(this).siblings('.tags').find('ul').height();
        $(this)
          .siblings('.tags')
          .animate(
            {
              height: isExpand ? autoHeight : '24px',
            },
            300
          );
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
        $(this).html(htmlStr);
        const autoHeight = $(this).siblings('.tags').find('ul').height();
        $(this)
          .siblings('.tags')
          .animate(
            {
              height: isExpand ? autoHeight : '24px',
            },
            300
          );
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
      const data = {
        lesson_type,
        filter_month,
        course_category,
        product_direction,
        professional_certify,
        filter_city,
        low_price,
        up_price,
        key_words,
        pageSize,
        currentPage,
      };
      queryData(data);
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
    // 加载标签数据
    $('#courseCategory').html(template('courseCategoryTmp', {}));
    $('#productDirection').html(template('productDirectionTmp', {}));
    $('#professionalCertify').html(template('professionalCertifyTmp', {}));

    setPage(currentPage, Math.ceil(130 / pageSize), function () {
      console.log('currentPage', currentPage);
    });
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
  function queryData(postData) {
    console.log('postData', postData);
  }

  /**
   * 切换 tab 事件
   * @param {string} initTagObj 初始标签值--页面路由传参
   * @param {Object} initTagObj 初始标签值--页面路由传参
   */
  function handleTabChange(type = 'generalLesson', initTagObj = {}) {
    lesson_type = type;
    initTag(initTagObj); // 初始化标签
    key_words = ''; // 初始化关键词搜索
    $('.search-lessons .search-inp .form-control').val('');
    switch (lesson_type) {
      case 'generalLesson':
      case 'faceLesson':
        $('#filterMonth').show();
        $('#courseCategory').show();
        $('#productDirection').show();
        $('#professionalCertify').hide();
        $('#filterCity').show();
        $('#filterPrice').show();
        break;
      case 'onlineLesson':
        $('#filterMonth').hide();
        $('#courseCategory').show();
        $('#productDirection').show();
        $('#professionalCertify').hide();
        $('#filterCity').hide();
        $('#filterPrice').show();
        break;
      case 'professionalCertify':
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
  }

  /**
   * 初始化标签选值
   * @param {String} filterMonth 月份
   * @param {String} courseType 课程类型
   * @param {String} productDirection 专业方向
   * @param {String} professionalCertify 职业认证
   * @param {String} filterCity 城市
   * @param {String} filterPrice 价格
   */
  function initTag({
    filterMonth,
    courseCategory,
    productDirection,
    professionalCertify,
    filterCity,
    filterPrice,
  }) {
    filterMonth = filterMonth ? filterMonth : 'all';
    courseCategory = courseCategory ? courseCategory : 'all';
    productDirection = productDirection ? productDirection : 'all';
    professionalCertify = professionalCertify ? professionalCertify : 'all';
    filterCity = filterCity ? filterCity : 'all';
    filterPrice = filterPrice ? filterPrice : 'all';
    changeTagValue({ id: 'courseCategory', tag: courseCategory });
    changeTagValue({ id: 'filterMonth', tag: filterMonth });
    changeTagValue({ id: 'productDirection', tag: productDirection });
    changeTagValue({ id: 'professionalCertify', tag: professionalCertify });
    changeTagValue({ id: 'filterCity', tag: filterCity });
    changeTagValue({ id: 'filterPrice', tag: filterPrice });
  }

  /**
   * 切换选中标签时，更新隐藏表单数据--做查询用
   * @param {String} id tag标签父id--必填
   * @param {String} tag tag标签值--必填
   * @param {Function} cb 回调函数，参数为form序列化数据
   * @param {String} type 类型（single | mutiple），默认为多选
   * @returns null
   */
  function changeTagValue({ id, tag, cb, type = 'multiple' }) {
    const container = $(`#${id}`); // 当前 field 容器
    const that = container.find(`.tag[data-tag="${tag}"]`); // 当前点击的标签
    const isAll = that.data('tag') === 'all'; // 是否点击 “全部”

    if (type === 'single') {
      const currentTag = container.find('.active').data('tag');
      if (tag === currentTag) return; // 点击单签选中标签--直接返回不做处理
      container.find('.tag').removeClass('active');
      that.addClass('active');
      const tagString = isAll ? '' : tag;
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
        if ($(this).hasClass('active')) tagsArr.push($(this).data('tag'));
      });

      // 判断点击是否为全部按钮--其他控全部/全部清其他
      if (!isAll) {
        if (!tagsArr.length || tagsArr.length === tags.length) {
          container.find('.all').addClass('active');
        } else {
          container.find('.all').removeClass('active');
        }
      } else {
        if (!tagsArr.length) return;
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
      const data = {
        lesson_type,
        filter_month,
        course_category,
        product_direction,
        professional_certify,
        filter_city,
        low_price,
        up_price,
        key_words,
        pageSize,
        currentPage,
      };
      cb(data);
    }
  }
});
