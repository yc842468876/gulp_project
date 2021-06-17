const utils = {
  /**
   * 获取url中的参数
   * @param {String} name
   * @returns
   */
  getUrlParam: function getUrlParam(name) {
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
  },
};
