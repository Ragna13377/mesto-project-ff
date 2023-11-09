import '../pages/index.css';
import { initialCards } from "./cards.js"
import { deleteCard, likeCard, makeCard } from "@/components/cards.js"
import { openPopup, closePopup } from "@/components/modal.js"

const cardTemplate = document.querySelector('#card-template').content;
const cardContainer = document.querySelector('.places__list');
const popupNewCard = document.querySelector('.popup_type_new-card');
const triggerNewCard = document.querySelector('.profile__add-button');
const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupTypeImage = document.querySelector('.popup_type_image');
const triggerTypeEdit = document.querySelector('.profile__edit-button');
const title = document.querySelector('.profile__title');
const description = document.querySelector('.profile__description');
const popupTitle = popupTypeEdit.querySelector('input[name="name"]');
const popupDescription = popupTypeEdit.querySelector('input[name="description"]');

const setProfileInfo = () => {
  if(popupTitle.value === '' && popupDescription.value === '') {
    popupTitle.value = title.textContent;
    popupDescription.value = description.textContent;
  }
}

const setImageInfoPopup = (e) => {
  popupTypeImage.querySelector('.popup__image').src = e.target.src;
  popupTypeImage.querySelector('.popup__caption').textContent = e.target.closest('.card').querySelector('.card__description').textContent;
}

const submitAddCardPopup = (formData) => {
  addCard({ name: formData.get('place-name'), link: formData.get('link') });
}


const submitEditProfilePopup = (formData) => {
  title.textContent = formData.get('name');
  description.textContent = formData.get('description');
};

const closePopupHandler = (e, popup) => {
  if(e.key === 'Escape' ||
    e.target.classList.contains('popup__close') ||
    e.target.closest('.popup__content') === null) {
    if(e.target.classList.contains('popup__close')) {
      popup.querySelector('.popup__form')?.reset();
    }
    closePopup(popup);
  }
}

const openPopupHandler = (popup, submitAction = null, setAction = null, e = null) => {
  openPopup(popup);
  if(setAction) setAction(e);
  popup.querySelector('.popup__form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if(submitAction) { submitAction(formData);}
    e.currentTarget?.reset();
    closePopup(popup);
  });
  popup.addEventListener('click', (e) => closePopupHandler(e, popup));
  document.addEventListener('keydown', (e) => closePopupHandler(e, popup));
};

function addCard(card) {
  if(card !== null) {
    const createdCard = makeCard(card, cardTemplate)
    createdCard.querySelector('.card__delete-button').addEventListener('click', deleteCard)
    createdCard.querySelector('.card__like-button').addEventListener('click', likeCard)
    createdCard.querySelector('.card__image').addEventListener('click', (e) => openPopupHandler(popupTypeImage, null, setImageInfoPopup, e))
    cardContainer.prepend(createdCard);
  }
}

for (let item of initialCards) {
  addCard(item);
}
triggerNewCard.addEventListener('click', () => openPopupHandler(popupNewCard, submitAddCardPopup));
triggerTypeEdit.addEventListener('click', () => openPopupHandler(popupTypeEdit, submitEditProfilePopup, setProfileInfo));


