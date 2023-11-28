const renderLoading = (button, isLoading = false, buttonText='Сохранить', loadingText='Сохранение...') => {
  if(isLoading) {
    button.textContent = loadingText;
    button.classList.add('popup__button_disabled');
    button.setAttribute('disabled', true);
  } else {
    button.textContent = buttonText;
    button.classList.remove('popup__button_disabled');
    button.removeAttribute('disabled');
  }
}

function handleSubmit(request, event, loadingText='Сохранение...') {
  event.preventDefault();
  const submitButton = event.submitter;
  const buttonText = submitButton.textContent;
  renderLoading(submitButton, true, loadingText);
  request(event.currentTarget)
    .then((formElement) => {
      formElement.reset();
    })
    .catch((error) => console.error(`Ошибка: ${error}`))
    .finally(() => {
      renderLoading(submitButton, false, buttonText);
    })
}

export { handleSubmit }