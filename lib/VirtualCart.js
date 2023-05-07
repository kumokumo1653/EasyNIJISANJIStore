import { log, error } from './Log';
export class VirtualCart {
  constructor(cart, callback) {
    this._cartName = cart;
    this.getCart(callback);
  }

  getCart(callback) {
    log(this._cartName);
    chrome.storage.local
      .get(this._cartName)
      .then((value) => {
        if (Object.keys(value).length == 0) {
          this._cart = {};
        } else {
          this._cart = value[this._cartName];
        }
        log(JSON.stringify(this._cart, null, 2));
        if (callback) {
          callback();
        }
      })
      .catch((v) => {
        error(v);
        this._cart = {};
      });
  }
  saveCart() {
    log(JSON.stringify(this._cart, null, 2));
    chrome.storage.local.set({ [this._cartName]: this._cart });
  }
  get cart() {
    return this._cart;
  }
  addItem(item) {
    this._cart[item.idetId] = {};
    this._cart[item.idetId].name = item.name;
    this._cart[item.idetId].idetId = item.idetId;
    this._cart[item.idetId].quantity = item.quantity;
    this._cart[item.idetId].unitPrice = item.unitPrice;
    this._cart[item.idetId].endOfSale = item.endOfSale;
    this._cart[item.idetId].URL = item.URL;
  }

  addItems(items) {
    Object.values(items).forEach((item) => {
      this.addItem(item);
    });
  }
  deleteItem(idetId) {
    delete this._cart[idetId];
  }

  deleteItemAll() {
    this._cart = {};
  }
}
