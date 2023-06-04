// define monkey patch function
const monkeyPatch = () => {
  let oldXHROpen = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function () {
    this.addEventListener('load', function () {
      const responseBody = this.responseText;
      document.getElementById('myDataHolder').setAttribute('response', responseBody);
    });
    return oldXHROpen.apply(this, arguments);
  };

  let oldXHRsend = window.XMLHttpRequest.prototype.send;
  window.XMLHttpRequest.prototype.send = function (postData) {
    document.getElementById('myDataHolder').setAttribute('payload', postData);
    return oldXHRsend.apply(this, arguments);
  };
};
monkeyPatch();
