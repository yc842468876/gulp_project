const xhr = new XMLHttpRequest();

xhr.open('GET', '/api/napi/phone/check/rules/');
xhr.send();
xhr.onload = function () {
  console.log(JSON.parse(xhr.responseText));
};
