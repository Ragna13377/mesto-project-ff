const showInputError = (popupSelectors, formElement, inputElement, validationMessage) => {
  inputElement.classList.add(popupSelectors.inputErrorClass);
  const error = formElement.querySelector(`#${inputElement.getAttribute('name')}-input-error`);
  error.classList.add(popupSelectors.errorClass);
  error.textContent = validationMessage;
}

const hideInputError = (popupSelectors, formElement, inputElement) => {
  inputElement.classList.remove(popupSelectors.inputErrorClass);
  const error = formElement.querySelector(`#${inputElement.getAttribute('name')}-input-error`);
  error.classList.remove(popupSelectors.errorClass);
  error.textContent = '';
}

const isValid = (formElement, inputElement, popupSelectors) => {
  if(!inputElement.validity.valid){
    const errorMessage = inputElement.validity.patternMismatch ? inputElement.dataset.errorMessage : inputElement.validationMessage
    showInputError(popupSelectors, formElement, inputElement, errorMessage);
  } else {
    hideInputError(popupSelectors, formElement, inputElement);
  }
}

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  })
}

const toggleButtonState = (inputList, formElement, validationConfig) => {
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
  if(hasInvalidInput(inputList)){
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
}

const setEventListeners = (formElement, popupSelectors) => {
  const inputList = Array.from(formElement.querySelectorAll(popupSelectors.inputSelector));
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement, popupSelectors);
      toggleButtonState(inputList, formElement, popupSelectors);
    })
  })
}

const enableValidation = (popupSelectors) => {
  const formList = Array.from(document.querySelectorAll(popupSelectors.formSelector));
  formList.forEach(formElement => {
    setEventListeners(formElement, popupSelectors);
  })
}

const clearValidation = (profileForm, validationConfig) => {
  const inputList = Array.from(profileForm.querySelectorAll(validationConfig.inputSelector));
  inputList.forEach(inputElement => hideInputError(validationConfig, profileForm, inputElement));
  toggleButtonState(inputList, profileForm, validationConfig);
}

export { enableValidation, clearValidation }