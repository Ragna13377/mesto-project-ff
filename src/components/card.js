import { updateElement, deleteElement, handleError } from "@/scripts/api"
const cardTemplate = document.querySelector('#card-template').content;

const deleteCard = (cardId) => document.querySelector('[data-id="' + cardId + '"]').remove()
const likeCard = (e) => e.classList.add('card__like-button_is-active');
const likeCardHandler = (e) => {
  const likeElement = e.target;
  const likeCount = likeElement.closest('.card__like-container').querySelector('.card__like-count');
  const cardId = likeElement.closest('.card').dataset.id;
  if(likeElement.classList.contains('card__like-button_is-active')){
    likeElement.classList.remove('card__like-button_is-active');
    deleteElement("/cards/likes/" + cardId)
      .then((response) => likeCount.textContent = response.likes.length)
      .catch(handleError)
  } else {
    likeCard(likeElement);
    updateElement("/cards/likes/" + cardId)
      .then((response) => likeCount.textContent = response.likes.length)
      .catch(handleError)
  }
}

function makeCard(card, openCardAction, deleteCardAction) {
    const cardItem = cardTemplate.querySelector('.card').cloneNode(true);
    cardItem.setAttribute('data-id', card._id)
    cardItem.querySelector('.card__image').src = card.link;
    cardItem.querySelector('.card__title').textContent = card.name;
    cardItem.querySelector('.card__like-count').textContent = card.likes.length;
    const deleteButton = cardItem.querySelector('.card__delete-button');
    if(card.currentUserId === card.owner._id) deleteButton.addEventListener('click', deleteCardAction)
    else deleteButton.remove();
    const hasOwnLike = card.likes.some(like => like._id === card.currentUserId);
    if(hasOwnLike) likeCard(cardItem.querySelector('.card__like-button'))
    cardItem.querySelector('.card__like-button').addEventListener('click', likeCardHandler);
    cardItem.querySelector('.card__image').addEventListener('click', () => openCardAction(card.link, card.name))
    return cardItem;
}

export { makeCard, deleteCard }


