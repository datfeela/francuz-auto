document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    header = document.querySelector('.header'),
        headerBurger = document.querySelector('.search-header__burger'),
        headerDropdownMenu = document.querySelector('.search-header__dropdown'),
        headerSearch = document.querySelector('.search-header'),
        headerSearchLowres = document.querySelector('.search-header__button_lowres'),
        headerSearchForm = document.querySelector('.search-header__item'),
        headerSearchInput = document.querySelector('.search-header__input'),
        themeChangerButton = document.querySelector('.theme-changer__button'),
        headerCart = document.querySelector('.search-header__button_buy');

    //observer за шапкой

    const callback = function (entries, observer) {
        if (entries[0].isIntersecting) {
            header.classList.remove('_scroll');
        } else {
            header.classList.add('_scroll');
        }
    };

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(header)

    //закрываю announcement

    const closeButton = document.querySelector('.announcement-header__close-button');

    if (getCookie('announcement') == 'hidden') {
        closeButton.parentNode.style.transition = 'none';
        closeButton.parentNode.classList.add('_hidden');
        header.classList.add('_no-announcement');
    }

    closeButton.addEventListener('click', () => {
        closeButton.parentNode.classList.add('_hidden');
        header.classList.add('_no-announcement');
        let currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);
        currentTime = currentTime.toUTCString();
        setCookie('announcement', 'hidden', { sameSite: 'Strict', expires: currentTime});
    })

    //----------------------------CART-------------------------------//

    let cartCounter = document.querySelector('.search-header__counter');
    if (getCookie('totalQuantity') != undefined) {
        cartCounter.innerHTML = getCookie('totalQuantity')
    }
    if (cartCounter.innerHTML != '0') cartCounter.classList.add('_active');

    //---------------------BURGER-DROPDOWN---------------------------//

    //открываю/закрываю меню по нажатию на бургер
    headerBurger.addEventListener('click', (event) => {
        Array.from(headerDropdownMenu.querySelector('.dropdown-menu__list').children).forEach((elem) => {
            if (elem.classList.contains('_hover')) removeHoverDropdownMenu(elem);
        })
        headerBurger.classList.toggle('_active');
        if (document.documentElement.clientWidth <= 720) {
            body.classList.add('_no-scroll');
        }
    })

    //закрываю меню при нажатии вне меню/бургера
    document.addEventListener('click', (event) => {
        const targetElement = event.target;
        if ((!targetElement.closest('.search-header__burger') && !targetElement.closest('.search-header__dropdown')) || targetElement.closest('.dropdown-menu__free-space-cover') || targetElement.closest('.dropdown-menu__close-button')) {
            if (headerBurger.classList.contains('_active')) {
                Array.from(headerDropdownMenu.querySelector('.dropdown-menu__list').children).forEach((elem) => {
                    if (elem.classList.contains('_hover')) removeHoverDropdownMenu(elem);
                })
                headerBurger.classList.remove('_active');
                if (document.documentElement.clientWidth <= 720) {
                    body.classList.remove('_no-scroll');
                }
            }
        }
    })

    //снимаю с body no-scroll при изменении разрешения на > 720
    window.addEventListener('resize', (event) => {
        if (document.documentElement.clientWidth > 720) {
            if (body.classList.contains('_no-scroll')) body.classList.remove('_no-scroll');
        }
    })


    //вешаю на каталог итемы ._hover
    headerDropdownMenu.addEventListener('mouseover', (event) => {
        if (document.documentElement.clientWidth > 720) {
            const targetElement = event.target;
            let hoverElemSiblings;
            if (targetElement.closest('.dropdown-menu__item')) {
                targetElement.closest('.dropdown-menu__item').classList.add('_hover');
                hoverElemSiblings = Array.from(targetElement.closest('.dropdown-menu__item').parentNode.children);
                hoverElemSiblings.forEach((elem) => {
                    if (targetElement.closest('.dropdown-menu__item') != elem && elem.classList.contains('_hover')) {
                        removeHoverDropdownMenu(elem);
                    }
                });
            }
        }
    });

    //снимаю ._hover на <=720px

    window.addEventListener('resize', (event) => {
        if (document.documentElement.clientWidth < 721) {
            let hoverElem = headerDropdownMenu.querySelector('._hover');
            if (hoverElem) hoverElem.classList.remove('_hover');
        }
    })

    //вывод саблистов

    header.addEventListener('click', (event) => {
        const targetElement = event.target;
        if (targetElement.closest('.dropdown-menu__expand-button')) {
            const sublist = targetElement.closest('.dropdown-menu__item').querySelector('.dropdown-menu__sublist');
            const button = targetElement.closest('.dropdown-menu__expand-button');

            $(sublist).slideToggle();
            button.classList.toggle('_active')
        }
    })

    //display: block для саблистов на >720px
    window.addEventListener('resize', (event) => {
        if (document.documentElement.clientWidth > 720) {
            sublistArr = Array.from(document.querySelectorAll('.dropdown-menu__sublist'));
            sublistArr.forEach(sublist => {
                if (getComputedStyle(sublist).display == 'none') {
                    sublist.style.display = 'block';
                }
            })
        }
    })


    //открываю/закрываю поиск по нажатию на кнопку
    headerSearch.addEventListener('click', (event) => {
        const targetElement = event.target;
        if (document.documentElement.clientWidth < 720 && (targetElement.closest('.search-header__button_lowres') || targetElement.closest('.search-header__icon_close'))) {
            headerSearchLowres.classList.toggle('_active');
            headerSearchForm.classList.toggle('_active');
        }
    });

    //закрываю поиск при нажатии вне кнопки/поля
    document.addEventListener('click', (event) => {
        const targetElement = event.target;
        if (document.documentElement.clientWidth < 720 && !targetElement.closest('.search-header__item') && !targetElement.closest('.search-header__button_lowres')) {
            if (headerSearchForm.classList.contains('_active')) {
                headerSearchLowres.classList.remove('_active');
                headerSearchForm.classList.remove('_active');
            }
        }
    });

    //dark-theme
    themeChangerButton.addEventListener('click', (event) => {
        if (body.classList.contains('dark-theme')) {
            setCookie('theme', 'bright', {sameSite: 'Strict', expires: 'Tue, 19 Jan 2038 03: 14: 07 GMT'});
        }
        else {
            setCookie('theme', 'dark', {sameSite: 'Strict', expires: 'Tue, 19 Jan 2038 03: 14: 07 GMT' });
        }
        themeChangerButton.classList.toggle('_active');
        body.classList.toggle('dark-theme');
    })

    //functions
    //снимаю ._hover при скрытии меню
    function removeHoverDropdownMenu(elem) {
        elem.classList.remove('_hover');
        if (elem.lastElementChild.classList.contains('dropdown-menu__sublist')) {
            Array.from(elem.lastElementChild.children).forEach((elemChild) => {
                if (elemChild.classList.contains('_hover')) {
                    removeHoverDropdownMenu(elemChild);
                    elemChild.classList.remove('_hover');
                }
            });
        }
    }
})
