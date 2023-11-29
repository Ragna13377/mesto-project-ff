import '../pages/index.css';
import { makeCard, deleteCard, likeCardHandler } from "@/components/card.js";
import { enableValidation } from "./validation.js";
import { handleSubmit, triggerHandler } from "./util.js";
import { getInitialData, updateElement, createElement, deleteElement, handleError } from "./api.js";
import {closeCrossHandler, closeOutsideHandler, openPopup} from "@/components/modal.js";
import { cardContainer, profile, popupNewCard, popupDeleteCard, popupEditAvatar, popupEditProfile, popupTypeImage } from "./variables.js"

let currentUserId = '';

const setProfileInfo = () => {
  popupEditProfile.title.value = profile.title.textContent;
  popupEditProfile.description.value = profile.description.textContent;
}

const addNewCardRequest = (event) => {
  const formData = new FormData(event.currentTarget);
  const requestedData = { name: formData.get('place-name'), link: formData.get('link') };
  function makeRequest(formElement) {
    return createElement('/cards', requestedData)
      .then(response => {
        addCard(response);
        return formElement;
      })
  }
  handleSubmit(makeRequest, event);
}

const editProfileRequest = (event) => {
  const formData = new FormData(event.currentTarget);
  const requestedData = {name: formData.get('name'), about: formData.get('description')};
  function makeRequest(formElement) {
    return updateElement("/users/me", requestedData, true)
      .then(response => {
        profile.title.textContent = response.name;
        profile.description.textContent = response.about;
        return formElement;
      })
  }
  handleSubmit(makeRequest, event);
}

const editProfileAvatarRequest = (event) => {
  const formData = new FormData(event.currentTarget);
  const requestedData = {avatar: formData.get('avatar')}
  function makeRequest(formElement) {
    return updateElement('/users/me/avatar', requestedData, true)
      .then(response => {
        profile.image.style.backgroundImage = `url("${response.avatar}"`
        return formElement;
      })
  }
  handleSubmit(makeRequest, event);
}

const deleteCardRequest = (event) => {
  function makeRequest(formElement) {
    return deleteElement('/cards/' + event.currentTarget.dataset.id)
      .then(() => {
        deleteCard(formElement.dataset.id);
        return formElement;
      })
  }
  handleSubmit(makeRequest, event);
}

const openCardPopupHandler = (imageSrc, imageCaption) => {
  popupTypeImage.image.src = imageSrc;
  popupTypeImage.image.alt = imageCaption;
  popupTypeImage.caption.textContent = imageCaption;
  openPopup(popupTypeImage.rootElement);
}

const openDeletingCardPopupHandler = (e) => {
  popupDeleteCard.form.setAttribute('data-id', e.target.closest('.card').dataset.id);
  openPopup(popupDeleteCard.rootElement);
}

function addCard(card) {
  card.currentUserId = currentUserId;
  const createdCard = makeCard(card, openCardPopupHandler, openDeletingCardPopupHandler, likeCardHandler);
  cardContainer.prepend(createdCard);
}

triggerHandler(popupNewCard);
triggerHandler(popupEditProfile, setProfileInfo);
triggerHandler(popupEditAvatar);

popupNewCard.form.addEventListener('submit', addNewCardRequest)
popupEditProfile.form.addEventListener('submit', editProfileRequest)
popupEditAvatar.form.addEventListener('submit', editProfileAvatarRequest)
popupDeleteCard.form.addEventListener('submit', deleteCardRequest)

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

getInitialData('/users/me','/cards')
  .then(([user, cards] ) => {
    profile.title.textContent = user.name;
    profile.description.textContent = user.about;
    profile.image.style.backgroundImage = `url("${user.avatar}"`
    profile.image.src = user.avatar;
    currentUserId = user._id;
    cards.forEach(item => addCard(item));
  })
  .catch(handleError)
