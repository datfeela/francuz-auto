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

document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    header = document.querySelector('.header'),
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
            header.classList.remove('_scroll');
        } else {
            header.classList.add('_scroll');
        }
    };

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(header)

    //закрываю announcement по нажатию на кнопку

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
            setCookie('theme', 'bright', {sameSite: 'Strict', expires: 'Tue, 19 Jan 2038 03: 14: 07 GMT'});
        }
        else {
            setCookie('theme', 'dark', {sameSite: 'Strict', expires: 'Tue, 19 Jan 2038 03: 14: 07 GMT' });
        }
        themeChangerButton.classList.toggle('_active');
        body.classList.toggle('dark-theme');
    })
})
;

document.addEventListener('DOMContentLoaded', () => {
    const mainBlock = document.querySelector('.main__search-result'),
        heading = document.querySelector('.search-result__title');
    let cartCounter = document.querySelector('.search-header__counter'),
        searchRequest = location.search.slice(8).toUpperCase();

    fixSearchRequest();

    heading.insertAdjacentText('beforeend', searchRequest);

    getData();

    mainBlock.addEventListener('click', (event) => {
        const targetElement = event.target;
        if (targetElement.closest('.search-data__button_buy')) {
            event.preventDefault();
            targetElement.closest('.search-data__button_buy').classList.add('onclick')
            setTimeout(() => {
                targetElement.closest('.search-data__button_buy').classList.remove('onclick');
            }, 200);
            changeCookie(targetElement, '.search-data__row', 1)
            document.querySelector('.search-header__counter').innerHTML = +cartCounter.innerHTML + 1;
            if (cartCounter.innerHTML != '0') cartCounter.classList.add('_active');
        }
    })

    //functions
    async function getData() {
        const file = 'json/data.json';
        let response = await fetch(file, { method: 'GET' });
        if (response.ok) {
            let result = await response.json();
            loadData(result);
        } else {
            alert('something went wrong...');
        }
    }

    function loadData(data) {
        const productsSearchBlock = document.querySelector('#search-result-product'),
            productSearchAnalogs = document.querySelector('#search-result-analogs'),
            productSearchComplects = document.querySelector('#search-result-complects'),
            searchResultCover = document.querySelector('.search-result__cover');
        const ComplectsKeyword = 'КОМПЛЕКТ';
        let productFoundMain = false,
            productFoundAnalogs = false,
            productFoundComplects = false;

        data.forEach(element => {
            if ((element.col1 != '') && (searchRequest.length > 3) && (element.col2 == searchRequest || element.col3.includes(searchRequest))) {
                const productBrand = element.col1;
                const productName = element.col4;
                const productArticleNumber = element.col2;
                const productPrice = element.col6;
                let productQuantity,
                    productLink = productBrand + '_' + productArticleNumber;

                if (productBrand.split(' ')[1]) productLink = productBrand.split(' ')[0] + '_' + productBrand.split(' ')[1] + '_' + productArticleNumber;

                if (element.col8 == 0) productQuantity = 'Под заказ';
                else productQuantity = element.col8;

                let productTemplate = `
                <a href="product.html?id=${productLink}" class="search-data__row">
                    <div class="search-data__block search-data__block_brand">
                        <span class="search-data__text search-data__text_brand">${productBrand}</span>
                    </div>
                    <div class="search-data__block search-data__block_description">
                        <span class="search-data__text search-data__text_description">${productName}</span>
                    </div>
                    <div class="search-data__block search-data__block_article-number">
                        <span class="search-data__text search-data__text_article-number">${productArticleNumber}</span>
                    </div>
                    <div class="search-data__block search-data__block_price">
                        <span class="search-data__text search-data__text_price">${productPrice}₽</span>
                    </div>
                    <div class="search-data__block search-data__block_quantity">
                        <span class="search-data__text search-data__text_quantity">${productQuantity}</span>
                    </div>
                    <button class="search-data__button search-data__button_buy button" type="button">
                        <span class="search-data__button-text button__text">В корзину</span>
                    </button>
                </a>
                `;
                if (element.col2 == searchRequest) {
                    productFoundMain = true;
                    productsSearchBlock.insertAdjacentHTML('beforeend', productTemplate);
                }
                else if (element.col3.includes(searchRequest + ' ')) {
                    if (element.col4.includes(ComplectsKeyword)) {
                        productFoundComplects = true;
                        productSearchComplects.insertAdjacentHTML('beforeend', productTemplate);
                    }
                    else {
                        productFoundAnalogs = true;
                        productSearchAnalogs.insertAdjacentHTML('beforeend', productTemplate);
                    }
                }
            }
        });
        if (productFoundMain == true || productFoundAnalogs == true || productFoundComplects == true) mainBlock.classList.add('_active');
        if (productFoundMain == true) {
            productsSearchBlock.classList.add('_active');
            productsSearchBlock.previousElementSibling.classList.add('_active');
        }
        if (productFoundAnalogs == true) {
            productSearchAnalogs.classList.add('_active');
            productSearchAnalogs.previousElementSibling.classList.add('_active');
        }
        if (productFoundComplects == true) {
            productSearchComplects.classList.add('_active');
            productSearchComplects.previousElementSibling.classList.add('_active');
        }
        searchResultCover.style.display = 'none';
    }

    function fixSearchRequest() {
        if (searchRequest.indexOf('+') != -1) {
            let count = 0;
            let newSearchRequest = '';
            while (searchRequest.split('+')[count]) {
                newSearchRequest += searchRequest.split('+')[count];
                count++;
                if (searchRequest.split('+')[count]) newSearchRequest += ' ';
            }
            searchRequest = newSearchRequest;
        }
        console.log(searchRequest);
    }
});

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