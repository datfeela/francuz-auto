const header = document.querySelector(".header"),
    headerBurger = document.querySelector('.header__burger'),
    headerCatalog = document.querySelector('.search-header__dropdown'),
    headerSearch = document.querySelector('.search-header'),
    headerSearchLowres = document.querySelector('.search-header__button_lowres'),
    headerSearchForm = document.querySelector('.search-header__item');

//открываю/закрываю меню по нажатию на бургер
headerBurger.addEventListener('click', (event) => {
    Array.from(headerCatalog.firstElementChild.children).forEach((elem) => {
        if (elem.classList.contains('_hover')) removeHoverCatalog(elem);
    })
    headerBurger.classList.toggle('_active');
})

//закрываю меню при нажатии вне меню/бургера
document.addEventListener('click', (event) => {
    const targetElement = event.target;
    if (!targetElement.closest('.header__burger') && !targetElement.closest('.search-header__dropdown')) {
        if (headerBurger.classList.contains('_active')) {
            Array.from(headerCatalog.firstElementChild.children).forEach((elem) => {
                if (elem.classList.contains('_hover')) removeHoverCatalog(elem);
            })
            headerBurger.classList.remove('_active');
        }
    }
})

//вешаю на каталог итемы ._hover
headerCatalog.addEventListener('mouseover', (event) => {
    const targetElement = event.target;
    let hoverElemSiblings;
    if (targetElement.closest('.catalog__item')) {
        targetElement.closest('.catalog__item').classList.add('_hover');
        hoverElemSiblings = Array.from(targetElement.closest('.catalog__item').parentNode.children);
        hoverElemSiblings.forEach((elem) => {
            if (targetElement.closest('.catalog__item') != elem && elem.classList.contains('_hover')) {
                removeHoverCatalog(elem);
            }
        })
    }
})

//снимаю лишние ховеры при скрытии
function removeHoverCatalog(elem) {
    elem.classList.remove('_hover');
    if (elem.lastElementChild.classList.contains('catalog__sublist')) {
        Array.from(elem.lastElementChild.children).forEach((elemChild) => {
            if (elemChild.classList.contains('_hover')) {
                removeHoverCatalog(elemChild);
                elemChild.classList.remove('_hover');
            }
        })
    }
}

//открываю/закрываю поиск по нажатию на кнопку
headerSearch.addEventListener('click', (event) => {
    const targetElement = event.target;
    if (document.documentElement.clientWidth < 720 && (targetElement.closest('.search-header__button_lowres') || targetElement.closest('.search-header__icon_close'))) {
        headerSearchLowres.classList.toggle('_active');
        headerSearchForm.classList.toggle('_active');
    }
})

//закрываю поиск при нажатии вне кнопки/поля
document.addEventListener('click', (event) => {
    const targetElement = event.target;
    if (document.documentElement.clientWidth < 720 && !targetElement.closest('.search-header__item') && !targetElement.closest('.search-header__button_lowres')) {
        if (headerSearchForm.classList.contains('_active')) {
            headerSearchLowres.classList.remove('_active');
            headerSearchForm.classList.remove('_active');
        }
    }
})

//---//
//observer за шапкой

const callback = function (entries, observer) {
    if (entries[0].isIntersecting) {
        header.classList.remove("_scroll");
    } else {
        header.classList.add("_scroll");
    }
};

const headerObserver = new IntersectionObserver(callback);
headerObserver.observe(headerSearch);



