import { log } from 'my/lib/Log';
import { createElement } from 'my/lib/Element';
import { sendMessage } from 'my/lib/Message';
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
}
