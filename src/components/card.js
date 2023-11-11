import {closeCrossHandler, closeEscHandler, closeOutsideHandler, openPopup} from "@/components/modal.js";
import { popupTypeImage } from "@/scripts/index.js"

const deleteCard = (e) => e.target.closest('.card').remove();
const likeCard = (e) => e.target.classList.toggle('card__like-button_is-active');
const setImageInfoPopup = (popup, e) => {
    popup.image.src = e.target.src;
    popup.caption.textContent = e.target.closest('.card').querySelector('.card__description').textContent;
}

const openCardPopupHandler = (e) => {
    openPopup(popupTypeImage.element);
    setImageInfoPopup(popupTypeImage, e)
    popupTypeImage.element.addEventListener('click', closeOutsideHandler);
    popupTypeImage.element.addEventListener('click', closeCrossHandler);
    document.addEventListener('keydown', closeEscHandler);
}

function makeCard(card, template) {
    const cardItem = template.querySelector('.card').cloneNode(true);
    cardItem.querySelector('.card__image').src = card.link;
    cardItem.querySelector('.card__title').textContent = card.name;
    cardItem.querySelector('.card__delete-button').addEventListener('click', deleteCard);
    cardItem.querySelector('.card__like-button').addEventListener('click', likeCard);
    cardItem.querySelector('.card__image').addEventListener('click', openCardPopupHandler)
    return cardItem;
}

export { makeCard }


