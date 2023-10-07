const cardTemplate = document.querySelector('#card-template').content;
const cardContainer = document.querySelector('.places__list');

function showPopup(...popup) {
  for(let item of popup) {
    const popupContainer = document.querySelector(`.${item.popupBody}`);
    try {if (Array.isArray(item) || typeof item !== 'object') throw new Error('В функцию не передан объект');
      document.querySelector(`.${item.trigger}`).addEventListener('click', () => popupContainer.classList.add('popup_is-opened'))
      const popupForm = popupContainer.querySelector('.popup__form');
      popupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if(popupForm.name === "new-place"){
          const placeName = popupForm.querySelector("[name='place-name']"),
            link = popupForm.querySelector("[name='link']");
          showCard({name: placeName.value, link: link.value})
          placeName.value = link.value = '';
        }
        else{
          const name = popupForm.querySelector("[name='name']"),
            description = popupForm.querySelector("[name='description']");
          document.querySelector('.profile__title').textContent = name.value;
          document.querySelector('.profile__description').textContent = description.value;
          name.value = description.value = '';
        }
        popupContainer.classList.remove('popup_is-opened')
      })
        popupContainer.querySelector('.popup__close').addEventListener('click', () => popupContainer.classList.remove('popup_is-opened'))
    }
    catch (error){console.log(error)}
  }
}
function showCard(...cards){
  for (let item of cards){
    try {if (Array.isArray(item) || typeof item !== 'object') throw new Error('В функцию не передан объект');
      const cardItem = cardTemplate.querySelector('.card').cloneNode(true);
      const cardPopup = document.querySelector('.popup_type_image');
      cardItem.querySelector('.card__image').src = item.link;
      cardItem.querySelector('.card__title').textContent = item.name;
      cardItem.querySelector('.card__like-button').addEventListener('click', (e) => e.currentTarget.classList.toggle('card__like-button_is-active'));
      cardItem.querySelector('.card__delete-button').addEventListener('click', (e) => e.currentTarget.closest('.card').remove());
      cardItem.querySelector('.card__image').addEventListener('click', () => {
        document.querySelector('.popup_type_image').classList.add('popup_is-opened');
        cardPopup.querySelector('.popup__image').src = item.link;
        cardPopup.querySelector('.popup__caption').textContent = item.name;
      });
      cardContainer.append(cardItem);
    }
    catch (error){console.log(error)}
  }
}

showPopup({trigger: 'profile__add-button', popupBody: 'popup_type_new-card'}, {trigger: 'profile__edit-button', popupBody: 'popup_type_edit'});
showCard(...initialCards);