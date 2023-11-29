import {closePopup, openPopup} from "@/components/modal";
import {clearValidation} from "@/scripts/validation";
import {clearValidationOptions} from "@/scripts/variables";

const renderLoading = (button, isLoading = false, buttonText='Сохранить', loadingText='Сохранение...') => {
  if(isLoading) {
    button.textContent = loadingText;
    button.setAttribute('disabled', true);
  } else {
    button.textContent = buttonText;
    button.removeAttribute('disabled');
  }
}

function handleSubmit(request, event, loadingText='Сохранение...') {
  event.preventDefault();
  const submitButton = event.submitter;
  const buttonText = submitButton.textContent;
  renderLoading(submitButton, true, '',loadingText);
  request(event.currentTarget)
    .then((formElement) => {
      formElement.reset();
      closePopup(formElement.closest('.popup'));
    })
    .catch((error) => console.error(`Ошибка: ${error}`))
    .finally(() => {
      renderLoading(submitButton, false, buttonText);
    })
}

function triggerHandler(popup, action = () => {}) {
  popup.trigger.addEventListener('click', () => {
    popup.form.reset();
    action();
    clearValidation(popup.form, clearValidationOptions);
    openPopup(popup.rootElement);
  });
}

export { handleSubmit, triggerHandler }