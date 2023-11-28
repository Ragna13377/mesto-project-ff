import { updateElement, deleteElement, handleError } from "@/scripts/api"
const cardTemplate = document.querySelector('#card-template').content;

const deleteCard = (cardId) => document.querySelector('[data-id="' + cardId + '"]').remove()
const likeCard = (likeElement) => likeElement.classList.add('card__like-button_is-active');
const likeCardHandler = (e) => {
  const likeElement = e.target;
  const likeCount = likeElement.closest('.card__like-container').querySelector('.card__like-count');
  const cardId = likeElement.closest('.card').dataset.id;
  if(likeElement.classList.contains('card__like-button_is-active')){
    deleteElement("/cards/likes/" + cardId)
      .then((response) => {
        likeElement.classList.remove('card__like-button_is-active');
        likeCount.textContent = response.likes.length;
      })
      .catch(handleError)
  } else {
    updateElement("/cards/likes/" + cardId)
      .then((response) => {
        likeCard(likeElement);
        likeCount.textContent = response.likes.length;
      })
      .catch(handleError)
  }
}

function makeCard(card, openCardAction, deleteCardAction, likeCardAction) {
  const cardItem = cardTemplate.querySelector('.card').cloneNode(true);
  cardItem.setAttribute('data-id', card._id);
  const cardImage = cardItem.querySelector('.card__image');
  const likeButton = cardItem.querySelector('.card__like-button');
  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardItem.querySelector('.card__title').textContent = card.name;
  cardItem.querySelector('.card__like-count').textContent = card.likes.length;
  const deleteButton = cardItem.querySelector('.card__delete-button');
  if(card.currentUserId === card.owner._id) deleteButton.addEventListener('click', deleteCardAction)
  else deleteButton.remove();
  const hasOwnLike = card.likes.some(like => like._id === card.currentUserId);
  if(hasOwnLike) likeCard(likeButton)
  likeButton.addEventListener('click', likeCardAction);
  cardImage.addEventListener('click', () => openCardAction(card.link, card.name))
  return cardItem;
}

export { makeCard, deleteCard, likeCardHandler }


