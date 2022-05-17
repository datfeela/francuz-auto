function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}

function changeCookie(targetElement, closestLinkElem, amount) {
    let productID = targetElement.closest(closestLinkElem).href.split('id=')[1];
    changeQuantity(productID, amount);
    changeQuantity('totalQuantity', amount);
}

function changeQuantity(cookie, amount) {
    if (getCookie(cookie) == undefined) {
        setCookie(cookie, amount, { sameSite: 'Strict', expires: 'Tue, 19 Jan 2038 03: 14: 07 GMT' });
    }
    else {
        setCookie(cookie, +getCookie(cookie) + amount, { sameSite: 'Strict', expires: 'Tue, 19 Jan 2038 03: 14: 07 GMT' });
        if (getCookie(cookie) == 0) deleteCookie(cookie);
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    if (getCookie('theme') == 'dark') {
        document.querySelector('body').classList.add('dark-theme');
        document.querySelector('.theme-changer__button').classList.add('_active');
    }
});;
function fixString(string, symbol, newSymbol) {
    if (string.indexOf(symbol) != -1) {
        let count = 0;
        let newString = '';
        while (string.split(symbol)[count]) {
            newString += string.split(symbol)[count];
            count++;
            if (string.split(symbol)[count]) newString += newSymbol;
        }
        string = newString;
    }
    return string;
};
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
});;

document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    header = document.querySelector('.header'),
        headerMenu = document.querySelector('.search-header__menu'),
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
    headerMenu.addEventListener('click', (event) => {
        Array.from(headerDropdownMenu.querySelector('.dropdown-menu__list').children).forEach((elem) => {
            if (elem.classList.contains('_hover')) removeHoverDropdownMenu(elem);
        })
        headerBurger.classList.toggle('_active');
        headerMenu.classList.toggle('_active');
        if (document.documentElement.clientWidth <= 720) {
            body.classList.add('_no-scroll');
        }
    })

    //закрываю меню при нажатии вне меню/бургера
    document.addEventListener('click', (event) => {
        const targetElement = event.target;
        if ((!targetElement.closest('.search-header__menu') && !targetElement.closest('.search-header__dropdown')) || targetElement.closest('.dropdown-menu__free-space-cover') || targetElement.closest('.dropdown-menu__close-button')) {
            if (headerBurger.classList.contains('_active')) {
                Array.from(headerDropdownMenu.querySelector('.dropdown-menu__list').children).forEach((elem) => {
                    if (elem.classList.contains('_hover')) removeHoverDropdownMenu(elem);
                })
                headerBurger.classList.remove('_active');
                headerMenu.classList.remove('_active');
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
;
document.addEventListener('DOMContentLoaded', () => {
    const mainBlock = document.querySelector('.main'),
        popup = document.querySelector('.about__popup'),
        popupImage = document.querySelector('.popup__image');

    const swiperAbout = new Swiper('.images-about', {
        speed: 500,
        spaceBetween: 25,
        slidesPerView: 1,
        threshold: 30,
        loop: true,
        navigation: {
            nextEl: '.slider-controls-about__button_prev',
            prevEl: '.slider-controls-about__button_next',
        },

        breakpoints: {
            480: {
                slidesPerView: 2
            },
            800: {
                slidesPerView: 3
            },
            1050: {
                slidesPerView: 4
            },
        }
    });

    mainBlock.addEventListener('click', (event) => {
        const targetElement = event.target;


        if (targetElement.classList.contains('images-about__image')) {
            const imgId = targetElement.id.slice(3);

            popup.classList.toggle('_active');
            popupImage.src = targetElement.src;
            popupImage.previousElementSibling.srcset = `img/about/${imgId}.webp`;
        }
    })

    popup.addEventListener('click', (event) => {
        const targetElement = event.target;

        if (!targetElement.classList.contains('popup__image')) {
            popup.classList.toggle('_active');
        }
    })
});;
document.addEventListener('DOMContentLoaded', () => {
    $('.title-footer').click(function () {
        if (document.documentElement.clientWidth <= 560) {
            $(this).next().slideToggle();
            if ($(this).next().hasClass('contacts-footer__wrapper')) {
                $(this).next().css('display', 'flex');
            }
            $(this).toggleClass('_active');
        }
    });

    $(window).resize(function () {
        //делаю видимыми свернутые спойлеры и убираю их при изменении разрешения
        if (document.documentElement.clientWidth > 560) {
            $('.title-footer').next().css('display', 'block');
            if ($('.title-footer').next().hasClass('contacts-footer__wrapper')) {
                $('.contacts-footer__wrapper').css('display', 'flex');
            }
            if ($('.title-footer').hasClass('_active')) {
                $('.title-footer').removeClass('_active');
            }
        }
        if (document.documentElement.clientWidth <= 560) {
            if (!$('.title-footer').hasClass('_active')) {
                $('.title-footer').next().css('display', 'none');
            }
        }
    });
});


;