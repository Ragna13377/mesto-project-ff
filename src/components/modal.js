import {createCard} from './cards.js'
import {cardContainer} from '../scripts/index.js'

export function initPopup(popup) {
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

export const openPopup = (trigger, container, action = null) => {
  trigger
    .addEventListener('click', (e) => {
      e.stopPropagation();
      if(action !== null){
        action(container, e)
      }
    });
};

export const setDefaultPopup = (popup, e) => {
  popup.classList.add('popup_is-opened');
  closePopupVariants();
}

export const setEditInfoPopup = (popup, e) => {
  setDefaultPopup(popup, e);
  let formName = popup.querySelector('input[name="name"]');
  let formDescription = popup.querySelector('input[name="description"]');
  if(formName.value === '' && formDescription.value === '') {
    const profile = e.currentTarget.closest('.profile__info');
    formName.value = profile.querySelector('.profile__title').textContent;
    formDescription.value = profile.querySelector('.profile__description').textContent;
  }
}

export const setImageInfoPopup = (popup, e) => {
  if(e.target.classList.contains('card__image')){
    setDefaultPopup(popup, e);
    popup.querySelector('.popup__image').src = e.target.src;
    popup.querySelector('.popup__caption').textContent = e.target.closest('.card').querySelector('.card__description').textContent;
  }
}

function handleFormSubmit(e, action){
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  action(formData);
  closePopup(true);
}

export const submitEditProfilePopup = (formData) => {
  document.querySelector('.profile__title').textContent = formData.get('name');
  document.querySelector('.profile__description').textContent =
    formData.get('description');
};

export const submitAddCardPopup = (formData) =>
  createCard({ name: formData.get('place-name'), link: formData.get('link') }, cardContainer);


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



