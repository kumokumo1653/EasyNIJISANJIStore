import { log } from 'my/lib/Log';
import { createElement } from 'my/lib/Element';
import { categories } from './categories';

window.addEventListener('load', main, false);
function main(e) {
  let searchCategoryKey = 'all';
  let searchCategoryVal = 'all';

  document.querySelector('.title-area').lastElementChild.before(
    createElement(`
      <div class="d-flex" id="easy-search"> <div> 
    `)
  );
  document.querySelector('.title-area').classList.add('flex-wrap');
  const searchElem = document.querySelector('#easy-search');
  searchElem.lastElementChild.before(
    createElement(`
      <form class="form-inline display-large form_search_area pr-3" >
        <input class="form-control" id="text-keyword" type="search" placeholder="キーワード" name="keyword" maxlength="50">
      </form>
      `)
  );

  searchElem.lastElementChild.before(
    createElement(`
      <div class="dropdown pr-3">
        <button type="button" id="dropdown-category"
          class="btn dropdown-toggle"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false">
            カテゴリ
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdown-category" id="dropdown-menu-search">
        </div>
      </div> 
    `)
  );
  const dropdownMenuElem = document.querySelector('#dropdown-menu-search');
  log(dropdownMenuElem);
  dropdownMenuElem.append(
    createElement(`
    <div class="dropdown-item primary-category" data-search-key="all" data-search-val="all">すべて</div>
  `)
  );
  dropdownMenuElem.append(
    createElement(`
        <div class="dropdown-divider"></div>
  `)
  );

  //init keyword category
  new URL(window.location.href).searchParams.forEach(function (value, key) {
    //keyword
    if (key == 'word') {
      document.getElementById('text-keyword').value = value;
    }
    if (key == 'tp') {
      if (
        Object.values(categories.tp)
          .map((v) => Object.keys(v)[0])
          .includes(value)
      ) {
        searchCategoryKey = key;
        searchCategoryVal = value;
        document.getElementById('dropdown-category').innerText = Object.values(
          categories.tp[
            Object.values(categories.tp)
              .map((v) => Object.keys(v)[0])
              .indexOf(value)
          ]
        )[0];
      }
    }
    if (key == 'ct') {
      if (
        Object.values(categories.ct)
          .map((v) => Object.keys(v)[0])
          .includes(value)
      ) {
        searchCategoryKey = key;
        searchCategoryVal = value;
        document.getElementById('dropdown-category').innerText = Object.values(
          categories.ct[
            Object.values(categories.ct)
              .map((v) => Object.keys(v)[0])
              .indexOf(value)
          ]
        )[0];
      }
    }
  });

  categories.tp.forEach((tp, index) => {
    const tpKey = Object.keys(tp);
    const tpVal = Object.values(tp);
    dropdownMenuElem.append(
      createElement(`
      <div class="dropdown-item primary-category" data-search-key="tp" data-search-val="${tpKey}">${tpVal}</div>
    `)
    );
    if (tpKey == 'PHYSICAL') {
      categories.ct.forEach((ct) => {
        const ctKey = Object.keys(ct);
        const ctVal = Object.values(ct);
        if (ctKey[0].match('phy')) {
          dropdownMenuElem.append(
            createElement(`
            <div class="dropdown-item secondary-category" data-search-key="ct" data-search-val="${ctKey}">${ctVal}</div>
          `)
          );
        }
      });
    }
    if (tpKey == 'DIGITAL') {
      categories.ct.forEach((ct) => {
        const ctKey = Object.keys(ct);
        const ctVal = Object.values(ct);
        if (ctKey[0].match('dig')) {
          dropdownMenuElem.append(
            createElement(`
            <div class="dropdown-item secondary-category" data-search-key="ct" data-search-val="${ctKey}">${ctVal}</div>
          `)
          );
        }
      });
    }

    if (index != categories.tp.length - 1) {
      dropdownMenuElem.append(
        createElement(`
        <div class="dropdown-divider"></div> `)
      );
    }
  });
  searchElem.lastElementChild.before(
    createElement(`
    <button type="button" id="btn-search" class="btn pr-3">
    絞り込み
    </button>
    `)
  );

  document.querySelectorAll('#dropdown-menu-search .dropdown-item').forEach((elem) => {
    elem.addEventListener('click', (event) => {
      document.getElementById('dropdown-category').innerText = event.target.innerText;
      searchCategoryKey = event.target.getAttribute('data-search-key');
      searchCategoryVal = event.target.getAttribute('data-search-val');
    });
  });
  document.getElementById('btn-search').addEventListener('click', () => {
    const keywords = document.getElementById('text-keyword').value.replaceAll(/\s/g, '+');
    let url = window.location.href.substring(0, window.location.href.indexOf('?'));
    url += `?word=${keywords}&${searchCategoryKey}=${searchCategoryVal}`;
    window.location.href = url;
  });
}
