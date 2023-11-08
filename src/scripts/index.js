import '../pages/index.css';
import {createCard, initialCards} from "@/components/cards";
import {openPopup, initPopup, submitEditProfilePopup, submitAddCardPopup, setDefaultPopup, setEditInfoPopup, setImageInfoPopup} from "@/components/modal";

export const cardContainer = document.querySelector('.places__list');

for (let item of initialCards) {
  createCard(item, cardContainer);
}

openPopup(cardContainer, document.querySelector('.popup_type_image'), setImageInfoPopup)

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



