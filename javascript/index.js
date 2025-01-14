const initialCards = [
  { name: 'Архыз', link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg' },
  { name: 'Тулиновка', link: './images/mikhail-vasilyev-tulinovka.jpg' },
  { name: 'Иваново', link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg' },
  { name: 'Камчатка', link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg' },
  { name: 'Холмогорский район', link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg' },
  { name: 'Байкал', link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg' }
];

const obj = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Валидация форм
function enableValidation(obj) {
  const forms = Array.from(document.querySelectorAll(obj.formSelector));
  forms.forEach(form => {
    const inputs = Array.from(form.querySelectorAll(obj.inputSelector));
    const submitButton = form.querySelector(obj.submitButtonSelector);

    const toggleValidButton = () => {
      const isFormValid = form.checkValidity();
      submitButton.disabled = !isFormValid;
      submitButton.classList.toggle(obj.inactiveButtonClass, !isFormValid);
    };

    const handleInput = (evt) => {
      const input = evt.target;
      const error = document.querySelector(`#${input.id}-error`);
      if (input.validity.valid) {
        input.classList.remove(obj.inputErrorClass);
        error.textContent = '';
      } else {
        input.classList.add(obj.inputErrorClass);
        error.textContent = input.validationMessage;
      }
      toggleValidButton();
    };

    inputs.forEach(input => {
      input.addEventListener('input', handleInput);
    });

    form.addEventListener('input', toggleValidButton);
  });
}

enableValidation(obj);

// Создание карточек
function createCard(name, link) {
  const template = document.querySelector('.element-template').content;
  const cardElement = template.querySelector('.element').cloneNode(true);
  const cardImage = cardElement.querySelector('.element__cover');
  const cardTitle = cardElement.querySelector('.element__title');
  const cardInfo = cardElement.querySelector('.element__info');
  const cardLike = cardElement.querySelector('.element__like-button');
  const cardRemove = cardElement.querySelector('.element__remove');

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;

  cardImage.addEventListener('error', () => {
    cardImage.src = '';
    cardImage.alt = 'Image not available';
    cardInfo.style.position = 'absolute';
    cardInfo.style.bottom = '0px';
    cardLike.style.position = 'absolute';
    cardLike.style.right = '0px';
    cardRemove.style.backgroundImage = 'url(\'../../../images/my_images/remove_1.svg\')';
  });

  cardElement.querySelector('.element__like-button').addEventListener('click', () => {
    cardElement.querySelector('.element__like-button').classList.toggle('element__like-button_active');
  });

  cardElement.querySelector('.element__remove').addEventListener('click', () => {
    cardElement.remove();
  });

  cardImage.addEventListener('click', () => {
    const popupPreview = document.querySelector('.popup-preview');
    const popupImage = document.querySelector('.popup-preview__image');
    const popupCaption = document.querySelector('.popup-preview__caption');

    popupImage.src = link;
    popupImage.alt = name;
    popupCaption.textContent = name;
    popupPreview.classList.add('popup_opened');
  });

  return cardElement;
}

function addCard(name, link) {
  const card = createCard(name, link);
  document.querySelector('.elements').prepend(card);
}

initialCards.forEach(item => addCard(item.name, item.link));

// Попапы
const popupEdit = document.querySelector('.popup_edit');
const popupAdd = document.querySelector('.popup_add');
const popupPreview = document.querySelector('.popup-preview');

function togglePopup(popup) {
  popup.classList.toggle('popup_opened');
}

function closeByEsc(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_opened');
    if (openedPopup) togglePopup(openedPopup);
  }
}

window.addEventListener('keydown', closeByEsc);

const popups = Array.from(document.querySelectorAll('.popup'));
popups.forEach(popup => {
  popup.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('popup')) {
      togglePopup(popup);
    }
  });
});

document.querySelector('.popup-preview__close-button').addEventListener('click', () => {
  togglePopup(popupPreview);
});

document.querySelector('.profile__button_edit').addEventListener('click', () => {
  const nameInput = document.querySelector('.popup__input_edit_title');
  const jobInput = document.querySelector('.popup__input_edit_subtitle');
  nameInput.value = document.querySelector('.profile__title').textContent;
  jobInput.value = document.querySelector('.profile__subtitle').textContent;
  togglePopup(popupEdit);
});

document.querySelector('.popup__close-button').addEventListener('click', () => {
  togglePopup(popupEdit);
});

document.querySelector('.profile__button_add').addEventListener('click', () => {
  togglePopup(popupAdd);
});

document.querySelector('.popup__close-button_add').addEventListener('click', () => {
  togglePopup(popupAdd);
});

document.querySelector('.popup__form_edit').addEventListener('submit', (evt) => {
  evt.preventDefault();
  document.querySelector('.profile__title').textContent = document.querySelector('.popup__input_edit_title').value;
  document.querySelector('.profile__subtitle').textContent = document.querySelector('.popup__input_edit_subtitle').value;
  togglePopup(popupEdit);
});

document.querySelector('.popup__form_add').addEventListener('submit', (evt) => {
  evt.preventDefault();
  const name = document.querySelector('.popup__input_add_title').value;
  const link = document.querySelector('.popup__input_add_link').value;
  addCard(name, link);
  togglePopup(popupAdd);
  document.querySelector('.popup__input_add_title').value = '';
  document.querySelector('.popup__input_add_link').value = '';
});
