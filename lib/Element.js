export const createElement = function (html) {
  const elem = document.createElement('div');
  elem.innerHTML = html;
  return elem.firstElementChild;
};
