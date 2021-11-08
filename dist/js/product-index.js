function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        // при необходимости добавьте другие значения по умолчанию
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

document.addEventListener("DOMContentLoaded", (event) => {
    if (getCookie('theme') == 'dark') {
        document.querySelector('body').classList.add('dark-theme');
        document.querySelector('.theme-changer__button').classList.add('_active');
    }
});;
document.addEventListener("DOMContentLoaded", (event) => {
    const body = document.querySelector('body');
    header = document.querySelector(".header"),
        headerBurger = document.querySelector('.search-header__burger'),
        headerDropdownMenu = document.querySelector('.search-header__dropdown'),
        headerSearch = document.querySelector('.search-header'),
        headerSearchLowres = document.querySelector('.search-header__button_lowres'),
        headerSearchForm = document.querySelector('.search-header__item'),
        headerSearchInput = document.querySelector('.search-header__input'),
        themeChangerButton = document.querySelector('.theme-changer__button');

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
    });

    //dark-theme
    themeChangerButton.addEventListener('click', (event) => {
        if (body.classList.contains('dark-theme')) {
            setCookie('theme', 'bright', {sameSite: 'Strict', secure: true, expires: 'Tue, 19 Jan 2038 03: 14: 07 GMT'});
        }
        else {
            setCookie('theme', 'dark', {sameSite: 'Strict', secure: true, expires: 'Tue, 19 Jan 2038 03: 14: 07 GMT' });
        }
        themeChangerButton.classList.toggle('_active');
        body.classList.toggle('dark-theme');
    })
})
;
document.addEventListener("DOMContentLoaded", (event) => {
    let searchRequest = location.hash.slice(4);
    const productBlock = document.querySelector('.main__product');
    const head = document.querySelector('head');
    const title = document.querySelector('title');

    getData();

    //functions
    async function getData() {
        const file = "json/data.json";
        let response = await fetch(file, { method: "GET" });
        if (response.ok) {
            let result = await response.json();
            loadData(result);
        } else {
            alert("something went wrong...");
        }
    }

    function loadData(data) {
        let productFound = false;

        data.forEach(element => {
            if ((element.col1 != '') && (searchRequest.length > 3) && (element.col2 == searchRequest )) {
                productFound = true;
                const productBrand = element.col1;
                const productName = element.col4;
                const productArticleNumber = element.col2;
                const productPrice = element.col6;
                const productQuantity = element.col8;

                let productTemplate = `
                <h1 class="product__name">${productName}</h1>
                <div class="product__info">
                    <img class="product__image" src="img/product/no-image.png" alt="image" />
                    <div class="product__characteristic">
                        <div class="product__brand">
                            <span class="product__subtitle">Производитель</span>
                            <span class="product__text">${productBrand}</span>
                        </div>
                        <div class="product__article">
                            <span class="product__subtitle">Артикул</span>
                            <span class="product__text">${productArticleNumber}</span>
                        </div>
                    </div>
                    <div class="product__availibility">
                        <span class="product__price">${productPrice}₽</span>
                        <span class="product__quantity">В наличии ${productQuantity} шт.</span>
                    </div>
                </div>
                `;
                productBlock.insertAdjacentHTML("beforeend", productTemplate);
                title.insertAdjacentHTML("beforeend", `Француз-Авто | ${productName}`);
                head.insertAdjacentHTML("beforeend", `<meta name="description" content="${productName} в интернет-магазине Француз-Авто с гарантией и доставкой по Челябинску и области. Ознакомиться с фотографиями, техническими характеристиками и описанием." />`);
            }
        });

        if (productFound == true) productBlock.classList.add('_active');
    }
});

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
});


;