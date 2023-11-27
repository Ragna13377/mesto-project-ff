import '../pages/index.css';
import { makeCard, deleteCard } from "@/components/card.js";
import { enableValidation, clearValidation } from "./validation.js";
import { get, updateElement, createElement, deleteElement, handleError } from "./api.js";
import {
  closeCrossHandler,
  closeOutsideHandler,
  openPopup,
  closePopup
} from "@/components/modal.js";

let currentUserId = '';
const clearValidationOptions = {
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};
const cardContainer = document.querySelector('.places__list');
const profile = {
  title: document.querySelector('.profile__title'),
  description: document.querySelector('.profile__description'),
  image: document.querySelector('.profile__image'),
};
class Popup {
  constructor(rootElement, trigger = '') {
    let popup = document.querySelector(rootElement);
    this.rootElement = popup;
    if(trigger.length > 0) this.trigger = document.querySelector(trigger);
    this.form = popup.querySelector('.popup__form');
    this.button = popup.querySelector('.popup__button');
  }
}
const popupNewCard = new Popup('.popup_type_new-card', '.profile__add-button');
const popupDeleteCard = new Popup('.popup_type_delete-card');
const popupTypeEditProfile = new Popup('.popup_type_edit-profile', '.profile__image-edit-button');
const popupTypeEdit = new Popup('.popup_type_edit', '.profile__edit-button');
popupTypeEdit.title = popupTypeEdit.rootElement.querySelector('input[name="name"]');
popupTypeEdit.description = popupTypeEdit.rootElement.querySelector('input[name="description"]');

const popupTypeImage = {
  rootElement: document.querySelector('.popup_type_image'),
};
popupTypeImage.image = popupTypeImage.rootElement.querySelector('.popup__image');
popupTypeImage.caption = popupTypeImage.rootElement.querySelector('.popup__caption');

const lockForm = (popup, mustLock = false) => {
  if(mustLock) {
    popup.button.textContent = 'Сохранение...';
    popup.button.classList.add('popup__button_disabled');
  } else {
    popup.button.textContent = 'Сохранить';
    popup.button.classList.remove('popup__button_disabled');
  }
}

const setProfileInfo = () => {
  popupTypeEdit.title.value = profile.title.textContent;
  popupTypeEdit.description.value = profile.description.textContent;
}

const submitFormNewCard = (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  lockForm(popupNewCard, true);
  createElement('/cards', { name: formData.get('place-name'), link: formData.get('link') })
    .then(response => addCard(response))
    .catch(handleError)
    .finally(() => {
      closePopup(popupNewCard.rootElement);
      lockForm(popupNewCard)
    })
}

const submitFormEditProfile = (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const profileInfo = {name: formData.get('name'), about: formData.get('description')};
  lockForm(popupTypeEdit, true);
  updateElement("/users/me", profileInfo, true)
    .then(res => {
      profile.title.textContent = res.name;
      profile.description.textContent = res.about;
    })
    .catch(handleError)
    .finally(() => {
      closePopup(popupTypeEdit.rootElement);
      lockForm(popupTypeEdit);
    })
}

const submitFormEditProfileAvatar = (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const profileInfo = {avatar: formData.get('avatar')}
  lockForm(popupTypeEditProfile, true);
  updateElement('/users/me/avatar', profileInfo, true)
    .then(res => profile.image.style.backgroundImage = `url("${res.avatar}"`)
    .catch(handleError)
    .finally(() => {
      closePopup(popupTypeEditProfile.rootElement);
      lockForm(popupTypeEditProfile);
    })
}

const openCardPopupHandler = (imageSrc, imageCaption) => {
  popupTypeImage.image.src = imageSrc;
  popupTypeImage.caption.textContent = imageCaption;
  openPopup(popupTypeImage.rootElement);
}

const openDeletingCardPopupHandler = (e) => {
  popupDeleteCard.form.setAttribute('data-id', e.target.closest('.card').dataset.id);
  openPopup(popupDeleteCard.rootElement);
}

const formDeleteCardHandler = (e) => {
  e.preventDefault();
  lockForm(popupDeleteCard, true);
  deleteElement('/cards/' + e.currentTarget.dataset.id)
    .then(res => deleteCard(res.url.split('/').at(-1)))
    .catch(handleError)
    .finally(() => {
      closePopup(popupDeleteCard.rootElement);
      lockForm(popupDeleteCard);
    })
}

function addCard(card) {
  card.currentUserId = currentUserId;
  const createdCard = makeCard(card, openCardPopupHandler, openDeletingCardPopupHandler);
  cardContainer.prepend(createdCard);
}

popupNewCard.trigger.addEventListener('click', () => {
  popupNewCard.form.reset();
  clearValidation(popupNewCard.form, clearValidationOptions);
  openPopup(popupNewCard.rootElement);
});
popupTypeEdit.trigger.addEventListener('click', () => {
  setProfileInfo();
  clearValidation(popupTypeEdit.form, clearValidationOptions);
  openPopup(popupTypeEdit.rootElement)
});
popupTypeEditProfile.trigger.addEventListener('click', () => {
  popupTypeEditProfile.form.reset();
  clearValidation(popupTypeEditProfile.form, clearValidationOptions);
  openPopup(popupTypeEditProfile.rootElement);
});
popupNewCard.form.addEventListener('submit', submitFormNewCard);
popupTypeEdit.form.addEventListener('submit', submitFormEditProfile);
popupTypeEditProfile.form.addEventListener('submit', submitFormEditProfileAvatar);
popupDeleteCard.form.addEventListener('submit', formDeleteCardHandler);
Array.from(document.querySelectorAll('.popup')).forEach(popupElement => {
  popupElement.addEventListener('click', closeOutsideHandler);
  popupElement.addEventListener('click', closeCrossHandler);
})

enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
});

Promise.all([get('/users/me'), get('/cards')])
  .then(([user, cards] ) => {
    profile.title.textContent = user.name;
    profile.description.textContent = user.about;
    profile.image.style.backgroundImage = `url("${user.avatar}"`
    profile.image.src = user.avatar;
    cards.forEach(item => {
      currentUserId = user._id;
      addCard(item);
    })
  })
  .catch(handleError)
