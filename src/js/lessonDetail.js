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
      alert('formdata: ' + JSON.stringify(formdata));
    });
  }

  /**
   * 加载数据
   */
  function loadData() {}
});
