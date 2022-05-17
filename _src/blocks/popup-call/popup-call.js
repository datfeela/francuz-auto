document.addEventListener('DOMContentLoaded', () => {
    const popup = document.querySelector('.popup-call'),
        popupButtonHeader = document.querySelector('.menu-header__item_popup-call'),
        popupButtonFooter = document.querySelector('.menu-footer__popup-button'),
        popupButtonDropdown = document.querySelector('.dropdown-menu__popup-button'),
        popupCloseButton = document.querySelector('.popup-call__close-button'),
        expandButton = document.querySelector('.form-popup__button_expand'),
        expandingInput = document.querySelector('.form-popup__input_expand');

    popupCloseButton.addEventListener('click', () => {
        popup.classList.toggle('_active');
    })

    popupButtonHeader.addEventListener('click', () => {
        popup.classList.toggle('_active');
    })

    popupButtonDropdown.addEventListener('click', () => {
        popup.classList.toggle('_active');
    })

    popupButtonFooter.addEventListener('click', () => {
        popup.classList.toggle('_active');
    })

    expandButton.addEventListener('click', () => {
        expandButton.classList.toggle('_hidden');
        setTimeout(expandButton.style.position = 'absolute', 300);
        expandingInput.classList.toggle('_active');
    })
});