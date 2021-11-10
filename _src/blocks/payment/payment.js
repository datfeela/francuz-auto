document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body'),
        mastercardText = document.querySelector('.mastercard-text'),
        themeChangeButton = document.querySelector('.theme-changer__button');

    if (body.classList.contains('dark-theme')) {
        if (!mastercardText.classList.contains('_white')) mastercardText.classList.add('_white');
    }
    else {
        if (mastercardText.classList.contains('_white')) mastercardText.classList.remove('_white');
    }

    themeChangeButton.addEventListener('click', () => {
        mastercardText.classList.toggle('_white');
    })
})