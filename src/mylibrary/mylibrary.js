import { log } from 'my/lib/Log';
import { getCookies, getWithCredentials, getBlobWithCredentials } from 'my/lib/HttpRequest';
import { createElement } from 'my/lib/Element';

window.addEventListener('load', main, false);

const setLoading = (flag) => {
  if (flag) {
    document.getElementById('loading').classList.remove('d-none');
  } else {
    document.getElementById('loading').classList.add('d-none');
  }
};

const getOrders = async (cookies) => {
  let orderCount = 0;
  let page = 0;
  const orders = [];

  do {
    await getWithCredentials(
      `https://shop.nijisanji.jp/s/niji/order_history_mix?page=${page}&kb=digital&dy=10year`,
      cookies
    ).then((doc) => {
      const templateElem = doc.querySelectorAll('template');
      for (let i = 0; i < templateElem.length; i++) {
        const formElem = templateElem[i].content.querySelector('form[name="form_E0101"]');
        if (formElem != null) {
          formElem.querySelectorAll('*').forEach((elem) => {
            const matches = elem.textContent.match(/該当: {{ '(\d+)' === '' \? '0' : '(\d+)' }}/);
            if (matches) {
              orderCount = matches[1];
            }
          });
        }

        const ordersInTemplate = templateElem[i].content.querySelectorAll('cp-ordered-section[details-url]');
        ordersInTemplate.forEach((elem) => {
          orders.push(elem.getAttribute('details-url'));
        });
      }
      page++;
    });
  } while (orderCount > orders.length);
  return orders;
};

const getdigitalgoods = async (orders, cookies) => {
  const digitalgoods = [];
  for (let i = 0; i < orders.length; i++) {
    await getWithCredentials(orders[i], cookies).then((doc) => {
      log(doc);
      let date, time;
      [, date, time] = doc
        .querySelector('body')
        .innerHTML.match(/<cp-dd>(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})<\/cp-dd>/);
      const orderDate = new Date(`${date}T${time}.000+09:00`);

      Array.from(
        Array.from(doc.querySelectorAll('template'))
          .find((elem) => elem.attributes[0].name === 'v-slot:main')
          .content.querySelectorAll('cp-section>template')
      )
        .filter(
          (elem) =>
            elem.attributes[0].name === 'v-slot:body' &&
            elem.content.querySelectorAll('cp-clickable-text[href]').length != 0
        )[0]
        .content.querySelectorAll('cp-clickable-text[href]')
        .forEach((elem) => {
          digitalgoods.push({
            downloadURL: 'https://shop.nijisanji.jp' + elem.getAttribute('href'),
            name: elem.textContent.replace(/\n/g, '').trim(),
            date: orderDate,
          });
        });

      Array.from(
        Array.from(doc.querySelectorAll('template'))
          .find((elem) => elem.attributes[0].name === 'v-slot:main')
          .content.querySelectorAll('cp-section>template')
      )
        .filter(
          (elem) =>
            elem.attributes[0].name === 'v-slot:body' &&
            elem.content.querySelectorAll('cp-delivery-section-item[item-img-url][item-details-url]').length != 0
        )[0]
        .content.querySelectorAll('cp-delivery-section-item[item-img-url][item-details-url]')
        .forEach((elem) => {
          const itemURL = 'https://shop.nijisanji.jp' + elem.getAttribute('item-details-url');
          const imageURL = 'https://shop.nijisanji.jp' + elem.getAttribute('item-img-url');
          const itemNameElem = Array.from(elem.querySelectorAll('template')).find(
            (e) => e.attributes[0].name === 'v-slot:item_name'
          ).content;

          itemNameElem.querySelector('span').remove();
          const name = itemNameElem.textContent.replace(/\n/g, '').trim();

          digitalgoods.forEach((goods, index, array) => {
            if (goods.name === name) {
              array[index].itemURL = itemURL;
              array[index].imageURL = imageURL;
            }
          });
        });
    });
  }

  return digitalgoods;
};

function main(e) {
  setLoading(true);
  getCookies().then((cookies) => {
    getOrders(cookies).then((orders) => {
      getdigitalgoods(orders, cookies).then((goods) => {
        const getDate = (date) => {
          const y = date.getFullYear();
          const m = ('00' + (date.getMonth() + 1)).slice(-2);
          const d = ('00' + date.getDate()).slice(-2);
          return `${y}/${m}/${d}`;
        };

        const mylibraryElem = document.getElementById('my-library');
        goods.sort((a, b) => {
          if (a.date < b.date) {
            return -1;
          } else if (a.date < b.date) {
            return 1;
          } else {
            return 0;
          }
        });
        goods.reverse();
        log(goods);
        let workDate = new Date('2000/01/01 00:00:00');
        let workElem = null;
        for (let i = 0; i < goods.length; i++) {
          if (getDate(workDate) != getDate(goods[i].date)) {
            workDate = goods[i].date;
            workElem = mylibraryElem.appendChild(
              createElement(`
              <div class="container p-3">
                購入日: ${getDate(goods[i].date)}
                <div class="list-group my-2"></div>
              </div>
            `)
            );
          }

          workElem.querySelector('.list-group').appendChild(
            createElement(`
              <li class="list-group-item d-flex justify-content-between align-items-center">
              <img src="${goods[i].imageURL}" class="img-thumbnail img-goods" />
              <a href="${goods[i].itemURL}" class="fs-5 text-primary fw-bold text-decoration-none">${goods[i].name}</a>
              <a class="btn btn-outline-primary btn-download" role="button" href="${goods[i].downloadURL}">ダウンロード</div>
              </li>
          `)
          );
        }
        setLoading(false);
      });
    });
  });
  document.getElementById('btn-information').addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
}
