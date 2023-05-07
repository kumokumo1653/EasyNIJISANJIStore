import { VirtualCart } from '../lib/VirtualCart';
import { createElement } from '../lib/Element';
import { log } from '../lib/Log';
import { sendMessage, sendCredential } from '../lib/Message';

const injectScript = () => {
  var script = document.createElement('script');
  script.setAttribute('src', chrome.runtime.getURL('injectedScript.js'));
  (document.head || document.documentElement).appendChild(script);
  script.remove();
};

window.addEventListener('load', main, false);
function main(e) {
  //add my library page
  const head = document.head;
  head.insertAdjacentHTML(
    'beforeEnd',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,200,0,0" />'
  );
  if (document.getElementById('serch-button')) {
    const navbarElem = document.getElementById('serch-button').parentElement;
    navbarElem.lastElementChild.before(
      createElement(`<li class="nav-item text-light" id="btn-mylibrary"><div class="material-symbols-outlined">
collections_bookmark
</div></li>`)
    );

    const mylibraryElem = document.getElementById('btn-mylibrary');
    log(mylibraryElem);
    mylibraryElem.addEventListener('click', (e) => {
      sendMessage({ type: 'open_mylibrary' }).then((tab) => {});
    });
  }

  // tracking buy action
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
      sendResponse({ result: 'success' });
    }
    return true;
  });
}
