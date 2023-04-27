import { VirtualCart } from '../lib/VirtualCart';
function createElement(html) {
  const elem = document.createElement('div');
  elem.innerHTML = html;
  return elem.firstElementChild;
}

window.addEventListener('load', main, false);
function main(e) {
  const cartElem = document.querySelector('#virtual-cart');
  let totalCost = 0;
  //削除ボタン実装
  const clickDeleteBtn = (idetId) => {
    virtualCart.deleteItem(idetId);
    virtualCart.saveCart();
    cartElem.innerHTML = '';
    virtualCart.getCart(displayVirtualCart);
    chrome.tabs.query({}).then((result) => {
      result.forEach((tab) => {
        if (tab.url.match(/https:\/\/shop.nijisanji.jp\/.*/)) {
          console.log(tab);
          chrome.tabs.sendMessage(tab.id, { method: 'delete_item', idetId: idetId });
        }
      });
    });
  };

  const setLoading = (flag) => {
    if (flag) {
      document.getElementById('loading').classList.remove('d-none');
    } else {
      document.getElementById('loading').classList.add('d-none');
    }
  };
  const displayVirtualCart = () => {
    totalCost = 0;
    Object.values(virtualCart.cart).forEach((element) => {
      totalCost += element.unitPrice * element.quantity;
      cartElem.appendChild(
        createElement(`
  <li class="list-group-item d-flex justify-content-between align-items-center item-list">
    <div>
      <div class="item-name" data-idet="${element.idetId}">${element.name}</div>
   <div class="d-flex justify-content-start">
    <div>${element.unitPrice}円</div>
    <div>${element.quantity}個</div>
    </div>
        </div>
        <div class="fs-1">
          <a href="${element.URL}" target="_blank" rel="noopener noreferrer" class="material-symbols-outlined fs-1 text-decoration-none">display_external_input</a>
          <i class="material-symbols-outlined fs-1 delete-btn" role="button">delete</i>
        </div>
  </li>
  `)
      );
    });
    if (Object.values(virtualCart.cart).length != 0) {
      cartElem.appendChild(
        createElement(`
  <li class="list-group-item d-flex justify-content-between align-items-center">
    <div class="fs-3">
    合計
    </div>
    <div class="fs-3">
    ${totalCost}円
    </div>
    `)
      );
    } else {
      cartElem.appendChild(
        createElement(`
  <li class="list-group-item d-flex justify-content-between align-items-center">
        まだカートに何も入っていません
  </li>
        `)
      );
    }

    document.querySelectorAll('.item-list').forEach((elem) => {
      const idetId = elem.querySelector('[data-idet]').getAttribute('data-idet');
      elem.querySelector('.delete-btn').addEventListener('click', () => {
        clickDeleteBtn(idetId);
      });
    });
  };
  const virtualCart = new VirtualCart('virtualcart', displayVirtualCart);

  document.getElementById('btn-information').addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

  document.getElementById('btn-put-items').addEventListener('click', () => {
    if (Object.values(virtualCart.cart).length != 0) {
      setLoading(true);
      getCookies('nijisanji.jp').then((cookies) => {
        let header_cookies = '';
        let payload = '';
        cookies.forEach((cookie) => {
          header_cookies += `${cookie.name}=${cookie.value}; `;
        });

        Object.values(virtualCart.cart).forEach((item, index, array) => {
          payload = `items[${item.idetId}]=${item.quantity}`;

          fetch('https://shop.nijisanji.jp/s/niji/json/cart/change', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              Cookie: header_cookies,
            },
            body: encodeURI(payload),
          })
            .then((response) => response.json())
            .then((response) => {
              if (index == array.length - 1) {
                setLoading(false);
              }
            });
        });
      });
    }
  });
}

async function getCookies() {
  try {
    const cookies = await chrome.cookies.getAll({});
    return cookies;
  } catch (e) {}
}
