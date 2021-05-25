$(function () {
  let str = '';
  for (let i = 0; i < 100; i++) {
    const element = `<div>${i}</div>`;
    str += element;
  }
  $('#other').html(str);
});
