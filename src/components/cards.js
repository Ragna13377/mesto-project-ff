export {initialCards, createCard, deleteCard, likeCard}

const initialCards = [
  {
    name: 'Архыз',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg',
  },
  {
    name: 'Челябинская область',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg',
  },
  {
    name: 'Иваново',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg',
  },
  {
    name: 'Камчатка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg',
  },
  {
    name: 'Холмогорский район',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg',
  },
  {
    name: 'Байкал',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg',
  },
];

function createCard(card, container) {
  if(card !== null) container.prepend(addCard(card));
}

const deleteCard = (e) => e.target.closest('.card').remove();
const likeCard = (e) => e.target.classList.toggle('card__like-button_is-active')

function addCard(card) {
  try {
    if (Array.isArray(card) || typeof card !== 'object')
      throw new Error('Не передан объект данных');
    const cardTemplate = document.querySelector('#card-template').content;
    const cardItem = cardTemplate.querySelector('.card').cloneNode(true);
    cardItem.querySelector('.card__image').src = card.link;
    cardItem.querySelector('.card__title').textContent = card.name;
    return cardItem;
  } catch (error) {
    console.log(error);
    return null;
  }
}




