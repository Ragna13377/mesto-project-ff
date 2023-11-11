const searchOpenedPopup = () => document.querySelector('.popup_is-opened');
const resetForm = (popup) => popup.querySelector('.popup__form')?.reset();

const openPopup = (popup) => popup.classList.add('popup_is-opened');
const closePopup = (popup) => popup.classList.remove('popup_is-opened');
const closeByEsc = (popup) => {
  closePopup(popup);
  document.removeEventListener('keydown', closeEscHandler);
};
const closeEscHandler = (e) => {
  if(e.key === 'Escape') {
    closeByEsc(searchOpenedPopup());
  }
};

const closeOutsideHandler = (e) => {
  if(e.target.closest('.popup__content') === null) {
    closePopup(searchOpenedPopup());
  }
};

const closeCrossHandler = (e) => {
  if(e.target.classList.contains('popup__close')) {
    const openedPopup = searchOpenedPopup();
    resetForm(openedPopup);
    closePopup(openedPopup);
  }
}

export { closeCrossHandler, closeOutsideHandler, closeEscHandler, openPopup, closePopup }







