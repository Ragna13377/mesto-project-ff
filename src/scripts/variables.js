import Popup from "@/components/popup";

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
const popupNewCard = new Popup('.popup_type_new-card', '.profile__add-button');
const popupDeleteCard = new Popup('.popup_type_delete-card');
const popupEditAvatar = new Popup('.popup_type_edit-avatar', '.profile__image-edit-button');
const popupEditProfile = new Popup('.popup_type_edit', '.profile__edit-button');
popupEditProfile.title = popupEditProfile.rootElement.querySelector('input[name="name"]');
popupEditProfile.description = popupEditProfile.rootElement.querySelector('input[name="description"]');
const popupTypeImage = {
  rootElement: document.querySelector('.popup_type_image'),
};
popupTypeImage.image = popupTypeImage.rootElement.querySelector('.popup__image');
popupTypeImage.caption = popupTypeImage.rootElement.querySelector('.popup__caption');

export { clearValidationOptions, cardContainer, profile, popupNewCard, popupDeleteCard, popupEditAvatar, popupEditProfile, popupTypeImage }