const cardTemplate = document.querySelector('#card-template').content;
const deleteCard = (e) => e.target.closest('.card').remove();
const likeCard = (e) => e.target.classList.toggle('card__like-button_is-active');

function makeCard(card) {
    const cardItem = cardTemplate.querySelector('.card').cloneNode(true);
    cardItem.querySelector('.card__image').src = card.link;
    cardItem.querySelector('.card__title').textContent = card.name;
    cardItem.querySelector('.card__delete-button').addEventListener('click', deleteCard);
    cardItem.querySelector('.card__like-button').addEventListener('click', likeCard);
    return cardItem;
}

export { makeCard }


