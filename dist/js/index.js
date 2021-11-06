const body = document.querySelector('body');
header = document.querySelector(".header"),
    headerBurger = document.querySelector('.search-header__burger'),
    headerDropdownMenu = document.querySelector('.search-header__dropdown'),
    headerSearch = document.querySelector('.search-header'),
    headerSearchLowres = document.querySelector('.search-header__button_lowres'),
    headerSearchForm = document.querySelector('.search-header__item'),
    headerSearchInput = document.querySelector('.search-header__input');

//observer за шапкой

const callback = function (entries, observer) {
    if (entries[0].isIntersecting) {
        header.classList.remove("_scroll");
    } else {
        header.classList.add("_scroll");
    }
};

const headerObserver = new IntersectionObserver(callback);
headerObserver.observe(header)

//------------------------------------//

//закрываю announcement по нажатию на кнопку

const closeButton = document.querySelector('.announcement-header__close-button');
closeButton.addEventListener('click', (event) => {
    console.log(closeButton.parentNode);
    closeButton.parentNode.classList.add('_hidden');
    header.classList.add('_no-announcement');
})

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

// if (document.documentElement.clientWidth <= 720) {
//     body.classList.remove('_no-scroll');
// }

//снимаю с body no-scroll при изменении разрешения на > 720
window.addEventListener('resize', (event) => {
    if (document.documentElement.clientWidth > 720) {
        if (body.classList.contains('_no-scroll')) body.classList.remove('_no-scroll');
    }
})


//вешаю на каталог итемы ._hover
headerDropdownMenu.addEventListener('mouseover', (event) => {
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
});

//снимаю ._hover с каталог итемов при скрытии
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
});;

document.addEventListener("DOMContentLoaded", (event) => {
    const swiperMain = new Swiper('.slider-main__body', {
        speed: 800,
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        grabCursor: true,
        navigation: {
            nextEl: '.controls-slider-main__button_prev',
            prevEl: '.controls-slider-main__button_next',
        },
        autoplay: {
            delay: 6000,
            waitForTransition: true
        },
        breakpoints: {
            600: {
                speed: 1200,
            },
            900: {
                speed: 1600,
            }
        }
    });
});;
document.addEventListener("DOMContentLoaded", (event) => {
    const swiperMain = new Swiper('.bestsellers__body', {
        speed: 400,
        slidesPerView: 1,
        spaceBetween: 40,
        loop: false,
        navigation: {
            nextEl: '.controls-bestsellers__button_prev',
            prevEl: '.controls-bestsellers__button_next',
        },
        // autoplay: {
        //     delay: 6000,
        //     waitForTransition: true
        // },

        breakpoints: {
            525: {
                slidesPerView: 2
            },
            735: {
                slidesPerView: 3
            },
            950: {
                slidesPerView: 4
            },
            1150: {
                slidesPerView: 5
            },

        }
    });
});;

//спойлеры на <= 560px
document.addEventListener("DOMContentLoaded", (event) => {
    $(".title-footer").click(function () {
        if (document.documentElement.clientWidth <= 560) {
            $(this).next().slideToggle();
            if ($(this).next().hasClass("contacts-footer__wrapper")) {
                $(this).next().css("display", "flex");
            }
            $(this).toggleClass("_active");
        }
    });
});

$(window).resize(function () {
    //делаю видимыми свернутые спойлеры и убираю их при изменении разрешения
    if (document.documentElement.clientWidth > 560) {
        $(".title-footer").next().css("display", "block");
        if ($(".title-footer").next().hasClass("contacts-footer__wrapper")) {
            $(".contacts-footer__wrapper").css("display", "flex");
        }
        if ($(".title-footer").hasClass("_active")) {
            $(".title-footer").removeClass("_active");
        }
    }
    if (document.documentElement.clientWidth <= 560) {
        if (!$(".title-footer").hasClass("_active")) {
            $(".title-footer").next().css("display", "none");
        }
    }
});

;