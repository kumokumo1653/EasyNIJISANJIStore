import { VirtualCart } from '../lib/VirtualCart';

const isContainClass = (element, classname) => {
  return element.classList.contains(classname);
};

const getTextContent = (element) => {
  if (element === null) return null;
  return element.textContent ?? null;
};

const injectScript = () => {
  var script = document.createElement('script');
  script.setAttribute('src', chrome.runtime.getURL('injectedScript.js'));
  (document.head || document.documentElement).appendChild(script);
  script.remove();
};

window.addEventListener('load', main, false);
function main(e) {
  injectScript();
  const virtualCart = new VirtualCart('virtualcart');
  const dataHolder = document.createElement('div');
  dataHolder.setAttribute('id', 'myDataHolder');
  document.body.appendChild(dataHolder);
  const dataobserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      const URL = document.URL.replace(/\?.*$/, '');
      if (URL.match(/shop.nijisanji.jp/)) {
        if (mutation.type == 'attributes') {
          if (mutation.attributeName == 'response') {
            //cart 更新
            try {
              const changedItemIdetId = decodeURI(mutation.target.getAttribute('payload')).match(/\[(\d+)\]/)[1];
              const changedItemQuantity = decodeURI(mutation.target.getAttribute('payload')).match(/\d+$/)[0];
              const response = JSON.parse(mutation.target.getAttribute(mutation.attributeName));
              if (changedItemQuantity != 0) {
                for (const index in response.items) {
                  let item = response.items[index];
                  if (item.idetId == changedItemIdetId) {
                    let additem = {};
                    additem.idetId = item.idetId;
                    additem.name = decodeURIComponent(item.itemFullName);
                    additem.quantity = item.quantity;
                    additem.unitPrice = item.smallTotal / item.quantity;
                    additem.endOfSale = null;
                    additem.URL = URL;
                    virtualCart.addItem(additem);
                    break;
                  }
                }
              } else {
                virtualCart.deleteItem(changedItemIdetId);
              }

              virtualCart.saveCart();
            } catch (error) {}
          }
        }
      }
    });
  });
  dataobserver.observe(dataHolder, {
    attributes: true,
  });

  //popupからの削除メッセージの受信
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method == 'delete_item') {
      virtualCart.deleteItem(request.idetId);
      virtualCart.saveCart();
      virtualCart.getCart();
    }
  });
}
