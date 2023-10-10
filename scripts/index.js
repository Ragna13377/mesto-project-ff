const cardTemplate = document.querySelector('#card-template').content;
const cardContainer = document.querySelector('.places__list');
const openPopup = (trigger, container) => {
  document
    .querySelector(`.${trigger}`)
    .addEventListener('click', (e) =>
      container.classList.add('popup_is-opened')
    );
};
const closePopup = (event) => {
  const popupContainer = event.target.closest('.popup');
  popupContainer.classList.remove('popup_is-opened');
  const form = popupContainer.querySelector('.popup__form');
  if (popupContainer.contains(form)) form.reset();
};
const actionEditProfilePopup = (formData) => {
  document.querySelector('.profile__title').textContent = formData.get('name');
  document.querySelector('.profile__description').textContent =
    formData.get('description');
};
const cardImageDelete = (target) =>
  target
    .querySelector('.card__delete-button')
    .addEventListener('click', (e) =>
      e.currentTarget.closest('.card').remove()
    );
const actionAddCardPopup = (formData) =>
  createCard({ name: formData.get('place-name'), link: formData.get('link') });

function initPopup(popup) {
  try {
    if (typeof popup !== 'object' || Array.isArray(popup)) {
      throw new Error('Не передан объект данных');
    }
    const popupContainer = document.querySelector(`.${popup.container}`);
    const popupForm = popupContainer.querySelector('.popup__form');
    openPopup(popup.trigger, popupContainer);
    popupContainer
      .querySelector('.popup__close')
      .addEventListener('click', (e) => closePopup(e));
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(popupForm);
      popup.action(formData);
      closePopup(e);
    });
  } catch (error) {
    console.log(error);
  }
}

function createCard(card) {
  if(card !== null) cardContainer.prepend(addCard(card, cardImageDelete));
}

function addCard(card, cardDeleteFunction) {
  try {
    if (Array.isArray(card) || typeof card !== 'object')
      throw new Error('Не передан объект данных');
    const cardItem = cardTemplate.querySelector('.card').cloneNode(true);
    cardItem.querySelector('.card__image').src = card.link;
    cardItem.querySelector('.card__title').textContent = card.name;
    cardItem
      .querySelector('.card__like-button')
      .addEventListener('click', (e) =>
        e.currentTarget.classList.toggle('card__like-button_is-active')
      );
    cardDeleteFunction(cardItem);
    const cardPopup = document.querySelector('.popup_type_image');
    cardItem.querySelector('.card__image').addEventListener('click', () => {
      cardPopup.classList.add('popup_is-opened');
      cardPopup.querySelector('.popup__image').src = card.link;
      cardPopup.querySelector('.popup__caption').textContent = card.name;
    });
    return cardItem;
  } catch (error) {
    console.log(error);
    return null;
  }
}

initPopup({
  container: 'popup_type_edit',
  trigger: 'profile__edit-button',
  action: actionEditProfilePopup,
});
initPopup({
  container: 'popup_type_new-card',
  trigger: 'profile__add-button',
  action: actionAddCardPopup,
});
for (let item of initialCards) {
  createCard(item);
}
document
  .querySelector('.popup_type_image')
  .querySelector('.popup__close')
  .addEventListener('click', (e) => closePopup(e));
