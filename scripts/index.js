const cardTemplate = document.querySelector('#card-template').content;
const cardContainer = document.querySelector('.places__list');

const openPopup = (event, container) => container.classList.add('popup_is-opened');
const closePopup = (event) => {
  const popupContainer = event.target.closest('.popup');
  popupContainer.classList.remove('popup_is-opened');
  popupContainer.querySelector('.popup__form').reset();
};
const actionEditProfilePopup = (formData) => {
  document.querySelector('.profile__title').textContent = formData.get('name');
  document.querySelector('.profile__description').textContent = formData.get('description');
}
const actionAddCardPopup = (formData) => addCard({name: formData.get('place-name'), link: formData.get('link')})

function initPopup(popup){
  try{
    if(typeof popup !== 'object' || Array.isArray(popup)){throw new Error('Не передан объект данных')}
    const popupContainer = document.querySelector(`.${popup.container}`);
    const popupForm = popupContainer.querySelector('.popup__form');
    document.querySelector(`.${popup.trigger}`).addEventListener('click', (e) => openPopup(e, popupContainer));
    popupContainer.querySelector('.popup__close').addEventListener('click', (e) => closePopup(e));
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(popupForm);
      popup.action(formData)
      closePopup(e);
    })
  }
  catch (error){console.log(error)}
}

const cardDeleteFunction = (e) => e.closest('.card').remove();

function addCard(...args){
  console.log(args)
}

// function showCard(deleteFunc, ...cards) {
//   for (let item of cards) {
//     try {
//       if (Array.isArray(item) || typeof item !== 'object')
//         throw new Error('В функцию не передан объект');
//       const cardItem = cardTemplate.querySelector('.card').cloneNode(true);
//       cardItem.querySelector('.card__image').src = item.link;
//       cardItem.querySelector('.card__title').textContent = item.name;
//       cardItem
//         .querySelector('.card__like-button')
//         .addEventListener('click', (e) =>
//           e.currentTarget.classList.toggle('card__like-button_is-active')
//         );
//       cardItem
//         .querySelector('.card__delete-button')
//         .addEventListener('click', (e) => cardDeleteFunction(e.currentTarget));
//       const cardPopup = document.querySelector('.popup_type_image');
//       cardItem.querySelector('.card__image').addEventListener('click', () => {
//         cardPopup.classList.add('popup_is-opened');
//         cardPopup.querySelector('.popup__image').src = item.link;
//         cardPopup.querySelector('.popup__caption').textContent = item.name;
//         const closePopup = () => {
//           cardPopup.classList.remove('popup_is-opened');
//           cardPopup
//             .querySelector('.popup__close')
//             .removeEventListener('click', closePopup);
//         };
//         cardPopup
//           .querySelector('.popup__close')
//           .addEventListener('click', closePopup);
//       });
//       cardContainer.append(cardItem);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

initPopup({container: 'popup_type_edit', trigger: 'profile__edit-button', action: actionEditProfilePopup})
initPopup({container: 'popup_type_new-card', trigger:'profile__add-button', action: actionAddCardPopup})
// showCard(cardDeleteFunction, ...initialCards);
