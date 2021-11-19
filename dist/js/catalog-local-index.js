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
    const searchRequest = new URL(location.href).searchParams.get('cat'),
        productsSearchBlock = document.querySelector('.catalog__items'),
        documentTitle = document.querySelector('title'),
        cartCounter = document.querySelector('.search-header__counter'),
        loadButton = document.querySelector('.catalog__load-more-button'),
        filters = document.querySelector('.sidebar__filters');
    let sortedData = [],
        filteredData = [],
        productsCount = 0,
        filterParams = {};

    changeTitle();
    getData();

    //подгрузка новых товаров
    loadButton.addEventListener('click', () => {
        //по фильтрам, если имеются
        if (filteredData.length > 0 && productsCount < filteredData.length) loadData(filteredData);
        //из сортированного по категории массива
        else if (productsCount < sortedData.length) loadData(sortedData);
    })

    filters.addEventListener('click', (event) => {
        const targetElement = event.target;

        if (targetElement.className == 'options-filter__label') {
            //сортировка по производителю
            if (targetElement.parentNode.parentNode.id == 'brands-filter') {
                if (!targetElement.previousElementSibling.checked) sortByBrand(1, targetElement.previousElementSibling.name);
                else {
                    sortByBrand(0, targetElement.previousElementSibling.name);
                    if (productsSearchBlock.querySelectorAll('.items-catalog__row').length == 0) loadData(sortedData);
                }
            }
        }
    })


    //functions

    async function getData() {
        const file = 'json/data.json';
        let response = await fetch(file, { method: 'GET' });
        if (response.ok) {
            let result = await response.json();
            sortData(result);
        } else {
            alert('something went wrong...');
        }
    }

    function sortData(data) {
        let keyword;
        switch (searchRequest) {
            case 'oil':
                keyword = 'МАСЛА и жидкости'
                break
            case 'lamps':
                keyword = 'лампа'
                break
            case 'filters':
                keyword = 'фильтры'
                break
        }
        sortedData = data.filter(element => element.col9 == keyword);
        loadFilters(sortedData);
        loadData(sortedData);
    }

    function loadData(data) {
        searchResultCover = document.querySelector('.items-catalog__cover');

        if (productsCount + 20 < data.length) {
            productsToLoadCount = 20;
            loadButton.classList.remove('_blocked');
        }
        else {
            productsToLoadCount = data.length - productsCount;
            loadButton.classList.add('_blocked');
        }

        for (let arrCount = productsCount; arrCount < productsCount + productsToLoadCount; arrCount++) {
            let element = data[arrCount];
            const productBrand = element.col1;
            const productArticleNumber = element.col2;
            const productName = element.col4;
            const productPrice = element.col6;
            let productLink = productBrand + '_' + productArticleNumber;

            if (productBrand.split(' ')[1]) productLink = productBrand.split(' ')[0] + '_' + productBrand.split(' ')[1] + '_' + productArticleNumber;

            let productTemplate = `
                <a href="product.html?id=${productLink}" class="items-catalog__row product">
                    <div class="product__block product__block_brand">
                        <span class="product__text product__text_brand">${productBrand}_${productArticleNumber}</span>
                    </div>
                    <div class="product__block product__block_description">
                        <span class="product__text product__text_description">${productName}</span>
                    </div>
                    <div class="product__block product__block_price">
                        <span class="product__text product__text_price">${productPrice}₽</span>
                    </div>
                    <button class="product__button product__button_buy button" type="button">
                        <span class="product__button-text button__text">В корзину</span>
                    </button>
                </a>
                `;
            productsSearchBlock.insertAdjacentHTML('beforeend', productTemplate);
        }
        productsCount += productsToLoadCount;
        searchResultCover.classList.add('_hidden');
    }

    function loadFilteredData() {
        Array.from(productsSearchBlock.querySelectorAll('.items-catalog__row')).forEach(element => {
            element.remove();
        })

        productsCount = 0;
        loadData(filteredData);
    }

    function changeTitle() {
        let titleText;
        const title = document.querySelector('.catalog__title');

        switch (searchRequest) {
            case 'oil':
                titleText = 'Масла и жидкости'
                break
            case 'lamps':
                titleText = 'Лампы'
                break
            case 'filters':
                titleText = 'Фильтры'
                break
        }
        title.insertAdjacentText('beforeend', titleText);
        documentTitle.insertAdjacentText('beforeend', `${titleText} | Француз-Авто`);
    }

    function loadFilters(data) {
        let brandsArr = [data[0].col1];
        const brandsFilterBlock = document.querySelector('#brands-filter');

        data.forEach(element => {
            let check = 0;
            brandsArr.forEach(el => {
                if (el == element.col1) check = 1;
            })
            if (check == 0) brandsArr.push(element.col1);
        });

        brandsArr.forEach(element => {
            brandsFilterBlock.insertAdjacentHTML('beforeend', `
                <div class="options-filter__item">
                    <input id="${element}" class="options-filter__checkbox" type="checkbox" name="${element}" value="${element}" />
                    <label class="options-filter__label" for="${element}"> ${element} </label>
                </div>
            `)
        })
    }

    function sortByBrand(checked, name) {
        const brandsFilter = document.querySelector('#brands-filter');
        let brandsArray = [];
        filteredData = [];

        Array.from(brandsFilter.children).forEach(element => {
            if (element.firstElementChild.checked == true) {
                brandsArray.push(element.firstElementChild.name);
            }
        })

        //если чекбокс чекнут, добавляю в массив только что чекнутый, если чек снят, удаляю из массива

        if (checked == 1) brandsArray.push(name);
        else {
            let deleteIndex = brandsArray.findIndex(function (item, index, array) {
                if (item == name) return item;
            })
            brandsArray.splice(deleteIndex, 1);
        }

        sortedData.forEach(element => {
            brandsArray.forEach(brand => {
                if (brand == element.col1) filteredData.push(element);
            })
        })

        loadFilteredData();
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