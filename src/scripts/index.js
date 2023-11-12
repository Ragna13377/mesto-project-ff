import '../pages/index.css';
import { initialCards } from "./cards.js"
import { makeCard } from "@/components/card.js"
import {
  closeCrossHandler,
  closeOutsideHandler,
  openPopup,
  closePopup
} from "@/components/modal.js"

const cardContainer = document.querySelector('.places__list');
class Profile {
  constructor(element){
    this.element = document.querySelector(element);
  }
  setValue (value) {
    this.element.textContent = value;
  }
  getValue() {
    return this.element.textContent;
  }
}
const titleProfile = new Profile('.profile__title');
const descriptionProfile = new Profile('.profile__description');

const triggerNewCard = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupNewCardForm = popupNewCard.querySelector('.popup__form');

const triggerTypeEdit = document.querySelector('.profile__edit-button');
const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupTypeEditForm = popupTypeEdit.querySelector('.popup__form');

class PopupProfile {
  constructor(element) {
    this.element = popupTypeEdit.querySelector(element);
  }
  setValue (value) {
    this.element.value = value;
  }
}
const popupProfileTitle = new PopupProfile('input[name="name"]');
const popupProfileDescription = new PopupProfile('input[name="description"]');

export const popupTypeImage = {
  element: document.querySelector('.popup_type_image'),
};
popupTypeImage.image = popupTypeImage.element.querySelector('.popup__image');
popupTypeImage.caption = popupTypeImage.element.querySelector('.popup__caption');

const setProfileInfo = () => {
  popupProfileTitle.setValue(titleProfile.getValue());
  popupProfileDescription.setValue(descriptionProfile.getValue());
}

const submitFormNewCard = (e) => {
  const formData = new FormData(e.currentTarget);
  addCard({ name: formData.get('place-name'), link: formData.get('link') });
}

const formNewCardHandler = (e) => {
  e.preventDefault();
  submitFormNewCard(e);
  popupNewCardForm.reset();
  closePopup(popupNewCard);
}

const submitFormEditProfile = (e) => {
  const formData = new FormData(e.currentTarget);
  titleProfile.setValue(formData.get('name'));
  descriptionProfile.setValue(formData.get('description'));
}

const formEditProfileHandler = (e) => {
  e.preventDefault();
  submitFormEditProfile(e);
  popupTypeEditForm.reset();
  closePopup(popupTypeEdit);
}

const openCardPopupHandler = (imageSrc, imageCaption) => {
  popupTypeImage.image.src = imageSrc;
  popupTypeImage.caption.textContent = imageCaption;
  openPopup(popupTypeImage.element);
}

function addCard(card, openCardAction) {
  const createdCard = makeCard(card, openCardAction);
  cardContainer.prepend(createdCard);
}

for (let item of initialCards) {
  addCard(item, openCardPopupHandler);
}

triggerNewCard.addEventListener('click', () => {
  popupNewCardForm.reset();
  openPopup(popupNewCard);
});
triggerTypeEdit.addEventListener('click', () => {
  setProfileInfo();
  openPopup(popupTypeEdit)
});
popupNewCardForm.addEventListener('submit', formNewCardHandler);
popupTypeEditForm.addEventListener('submit', formEditProfileHandler);
popupNewCard.addEventListener('click', closeOutsideHandler);
popupNewCard.addEventListener('click', closeCrossHandler);
popupTypeEdit.addEventListener('click', closeOutsideHandler);
popupTypeEdit.addEventListener('click', closeCrossHandler);
popupTypeImage.element.addEventListener('click', closeOutsideHandler);
popupTypeImage.element.addEventListener('click', closeCrossHandler);



