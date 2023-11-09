const deleteCard = (e) => e.target.closest('.card').remove();
const likeCard = (e) => e.target.classList.toggle('card__like-button_is-active')

function makeCard(card, template) {
  try {
    if (Array.isArray(card) || typeof card !== 'object')
      throw new Error('Не передан объект данных');
    const cardItem = template.querySelector('.card').cloneNode(true);
    cardItem.querySelector('.card__image').src = card.link;
    cardItem.querySelector('.card__title').textContent = card.name;
    return cardItem;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export { deleteCard, likeCard, makeCard }


