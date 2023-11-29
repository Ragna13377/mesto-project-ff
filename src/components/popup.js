//Дико извиняюсь, забыл запушить
export default class Popup {
  constructor(rootElement, trigger = '') {
    const popup = document.querySelector(rootElement);
    this.rootElement = popup;
    if(trigger.length > 0) this.trigger = document.querySelector(trigger);
    this.form = popup.querySelector('.popup__form');
    this.button = popup.querySelector('.popup__button');
  }
}
