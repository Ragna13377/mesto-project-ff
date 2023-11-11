const searchOpenedPopup = () => document.querySelector('.popup_is-opened');
const openPopup = (popup) => {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closeEscHandler);
}
const closePopup = (popup) => {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeEscHandler);
}

const closeEscHandler = (e) => {
  if(e.key === 'Escape') {
    closePopup(searchOpenedPopup());
  }
};

const closeOutsideHandler = (e) => {
  if(e.target.classList.contains('popup')) {
    closePopup(e.currentTarget);
  }
};

const closeCrossHandler = (e) => {
  if(e.target.classList.contains('popup__close')) {
    closePopup(e.currentTarget);
  }
}

export { closeCrossHandler, closeOutsideHandler, openPopup, closePopup }







