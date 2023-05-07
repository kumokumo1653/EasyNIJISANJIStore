import { log } from './Log';

//TODO textcontentで検索して該当Elementを取得したい

export const generateContextSelector = () => {
  Element.prototype.contextSelector = (regExpObj) => {
    const elements = document.querySelectorAll('*');

    return Array.from(elements).filter((element) => {
      return element.textContent;
    });
  };
};
