import { initialCards } from './cards.js';
import '../pages/index.css';

const cardTemplate = document.querySelector('#card-template').content;
const cardContainer = document.querySelector('.places__list');

const openPopup = (trigger, container, action = null) => {
  trigger
    .addEventListener('click', (e) => {
      e.stopPropagation();
      if(action !== null){
        action(container, e)
      }
    });
};

const submitEditProfilePopup = (formData) => {
  document.querySelector('.profile__title').textContent = formData.get('name');
  document.querySelector('.profile__description').textContent =
    formData.get('description');
};
const submitAddCardPopup = (formData) =>
  createCard({ name: formData.get('place-name'), link: formData.get('link') });

const deleteCardImage = (target) =>
  target
    .querySelector('.card__delete-button')
    .addEventListener('click', (e) =>
      e.currentTarget.closest('.card').remove()
    );

const setImageInfoPopup = (popup, e) => {
  if(e.target.classList.contains('card__image')){
    setDefaultPopup(popup, e);
    popup.querySelector('.popup__image').src = e.target.src;
    popup.querySelector('.popup__caption').textContent = e.target.closest('.card').querySelector('.card__description').textContent;
  }
}
const setEditInfoPopup = (popup, e) => {
  setDefaultPopup(popup, e);
  let formName = popup.querySelector('input[name="name"]');
  let formDescription = popup.querySelector('input[name="description"]');
  if(formName.value === '' && formDescription.value === '') {
    const profile = e.currentTarget.closest('.profile__info');
    formName.value = profile.querySelector('.profile__title').textContent;
    formDescription.value = profile.querySelector('.profile__description').textContent;
  }
}
const setDefaultPopup = (popup, e) => {
  popup.classList.add('popup_is-opened');
  closePopupVariants();
}

function initPopup(popup) {
  try {
    if (typeof popup !== 'object' || Array.isArray(popup)) {
      throw new Error('Не передан объект данных');
    }
    const popupContainer = document.querySelector(`.${popup.container}`);
    const popupForm = popupContainer.querySelector('.popup__form');
    openPopup(document.querySelector(`.${popup.trigger}`),   document.querySelector(`.${popup.container}`), popup.showAction);
    popupForm.addEventListener('submit', (e) => handleFormSubmit(e, popup.submitAction));
  } catch (error) {
    console.log(error);
  }
}

function handleFormSubmit(e, action){
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  action(formData);
  closePopup(true);
}

function createCard(card) {
  if(card !== null) cardContainer.prepend(addCard(card, deleteCardImage));
}

function addCard(card, cardDeleteFunction) {
  try {
    if (Array.isArray(card) || typeof card !== 'object')
      throw new Error('Не передан объект данных');
    const cardItem = cardTemplate.querySelector('.card').cloneNode(true);
    cardItem.querySelector('.card__image').src = card.link;
    cardItem.querySelector('.card__title').textContent = card.name;
    cardItem
      .querySelector('.card__like-button')
      .addEventListener('click', (e) =>
        e.currentTarget.classList.toggle('card__like-button_is-active')
      );
    cardDeleteFunction(cardItem);
    return cardItem;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function closePopupVariants(){
  document.addEventListener('click', closePopupHandler);
  document.addEventListener('keydown', closePopupHandler);
}

const closePopupHandler = (e) => {
  if(e.key === 'Escape' ||  e.target.classList.contains('popup__close') || e.target.closest('.popup__content') === null)
    closePopup(e.target.classList.contains('popup__close'));
}

const closePopup = (isReset) => {
  const popup = document.querySelector('.popup_is-opened');
  popup.classList.remove('popup_is-opened');
  if(isReset) {
    popup.querySelector('.popup__form')?.reset();
  }
  document.removeEventListener('click', closePopupHandler);
  document.removeEventListener('keydown', closePopupHandler);
}

initPopup({
  container: 'popup_type_edit',
  trigger: 'profile__edit-button',
  submitAction: submitEditProfilePopup,
  showAction: setEditInfoPopup,
});
initPopup({
  container: 'popup_type_new-card',
  trigger: 'profile__add-button',
  submitAction: submitAddCardPopup,
  showAction: setDefaultPopup,
});
for (let item of initialCards) {
  createCard(item);
}

openPopup(cardContainer, document.querySelector('.popup_type_image'), setImageInfoPopup)
