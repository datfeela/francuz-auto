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

    //observer ???? ????????????

    const callback = function (entries, observer) {
        if (entries[0].isIntersecting) {
            header.classList.remove('_scroll');
        } else {
            header.classList.add('_scroll');
        }
    };

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(header)

    //???????????????? announcement

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

    //????????????????/???????????????? ???????? ???? ?????????????? ???? ????????????
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

    //???????????????? ???????? ?????? ?????????????? ?????? ????????/??????????????
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

    //???????????? ?? body no-scroll ?????? ?????????????????? ???????????????????? ???? > 720
    window.addEventListener('resize', (event) => {
        if (document.documentElement.clientWidth > 720) {
            if (body.classList.contains('_no-scroll')) body.classList.remove('_no-scroll');
        }
    })


    //?????????? ???? ?????????????? ?????????? ._hover
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

    //???????????? ._hover ???? <=720px

    window.addEventListener('resize', (event) => {
        if (document.documentElement.clientWidth < 721) {
            let hoverElem = headerDropdownMenu.querySelector('._hover');
            if (hoverElem) hoverElem.classList.remove('_hover');
        }
    })

    //?????????? ??????????????????

    header.addEventListener('click', (event) => {
        const targetElement = event.target;
        if (targetElement.closest('.dropdown-menu__expand-button')) {
            const sublist = targetElement.closest('.dropdown-menu__item').querySelector('.dropdown-menu__sublist');
            const button = targetElement.closest('.dropdown-menu__expand-button');

            $(sublist).slideToggle();
            button.classList.toggle('_active')
        }
    })

    //display: block ?????? ?????????????????? ???? >720px
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


    //????????????????/???????????????? ?????????? ???? ?????????????? ???? ????????????
    headerSearch.addEventListener('click', (event) => {
        const targetElement = event.target;
        if (document.documentElement.clientWidth < 720 && (targetElement.closest('.search-header__button_lowres') || targetElement.closest('.search-header__icon_close'))) {
            headerSearchLowres.classList.toggle('_active');
            headerSearchForm.classList.toggle('_active');
        }
    });

    //???????????????? ?????????? ?????? ?????????????? ?????? ????????????/????????
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
    //???????????? ._hover ?????? ?????????????? ????????
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
    const mainBlock = document.querySelector('.main__cart');
    const cartCounter = document.querySelector('.search-header__counter');
    const submitForm = document.querySelector('.form-cart');
    const cartCover = document.querySelector('.cart__cover');
    let cookies = document.cookie.split('; ');
    let cookiesSorted = [];

    cookies.map(function (element) {
        if (element.split('=')[0] != 'beget' && element.split('=')[0] != 'announcement' && element.split('=')[0] != 'totalQuantity' && element.split('=')[0] != 'theme' && element.split('=')[0] != '_ym_uid' && element.split('=')[0] != '_ym_d' && element.split('=')[0] != '_ym_isad' ) {
            cookiesSorted.push(element);
        }
    })

    if (cookiesSorted.length > 0 && cookiesSorted[0] != '') getData();
    else {
        cartCover.style.display = 'none';
        mainBlock.classList.add('_empty');
    }

    mainBlock.addEventListener('click', (event) => {
        const targetElement = event.target;

        //??????????

        if (targetElement.closest('.search-data__button_minus')) {
            const parentRow = targetElement.closest('.search-data__button').parentNode.parentNode;
            const elementID = parentRow.dataset.id;
            let currentQuantity = +targetElement.closest('.search-data__button').nextElementSibling.innerHTML;

            targetElement.closest('.search-data__button_minus').setAttribute('disabled', true);

            if (currentQuantity > 1) {
                changeQuantity(elementID, -1);
                changeQuantity('totalQuantity', -1);
                cartCounter.innerHTML = +cartCounter.innerHTML - 1;
                currentQuantity -= 1;
                targetElement.closest('.search-data__button').nextElementSibling.innerHTML = currentQuantity;
                if (currentQuantity <= +parentRow.dataset.quantity) {
                    parentRow.querySelector('.search-data__block_quantity').classList.remove('_active-exclamation');
                }
            }
            else {
                deleteRow(elementID, targetElement);
            }

            calcFullPrice();
            fillTextarea();

            targetElement.closest('.search-data__button_minus').removeAttribute('disabled');
        }

        //????????

        if (targetElement.closest('.search-data__button_plus')) {
            const parentRow = targetElement.closest('.search-data__button').parentNode.parentNode;
            const elementID = parentRow.dataset.id;
            let currentQuantity = +targetElement.closest('.search-data__button').previousElementSibling.innerHTML;

            targetElement.closest('.search-data__button_plus').setAttribute('disabled', true);

            changeQuantity(elementID, 1);
            changeQuantity('totalQuantity', 1);
            cartCounter.innerHTML = +cartCounter.innerHTML + 1;
            currentQuantity += 1;
            targetElement.closest('.search-data__button').previousElementSibling.innerHTML = currentQuantity;
            if (currentQuantity > +parentRow.dataset.quantity) {
                parentRow.querySelector('.search-data__block_quantity').classList.add('_active-exclamation');
            }

            calcFullPrice();
            fillTextarea();

            targetElement.closest('.search-data__button_plus').removeAttribute('disabled');
        }

        //???????????????? ????????

        if (targetElement.closest('.search-data__button_delete')) {
            const elementID = targetElement.closest('.search-data__button_delete').parentNode.dataset.id;
            deleteRow(elementID);
        }

        //???????????? ???? ?????????????????????? ????????

        if (targetElement.closest('.search-data__cancel-button')) {
            targetElement.closest('.search-data__cancel-button').parentNode.classList.remove('_delete');
        }

        //???????????? ???????????????? ???????? ???? ?????????????????????? ????????

        if (targetElement.closest('.search-data__delete-button')) {
            const elementID = targetElement.closest('.search-data__delete-button').parentNode.dataset.id;
            const currentQuantity = targetElement.closest('.search-data__delete-button').parentNode.querySelector('.search-data__text_quantity').innerHTML;
            targetElement.closest('.search-data__delete-button').parentNode.remove();
            calcFullPrice();
            fillTextarea();
            deleteCookie(elementID);
            changeQuantity('totalQuantity', -currentQuantity);
            if (getCookie('totalQuantity')) {
                cartCounter.innerHTML = +getCookie('totalQuantity');
            }
            else {
                cartCounter.innerHTML = '';
                cartCounter.style.display = 'none';
                mainBlock.classList.add('_empty');
            }
        }
    })

    submitForm.addEventListener('submit', () => {
        setCookie('cartRequestSent', 'true', { sameSite: 'Strict', expires: 'Tue, 19 Jan 2038 03: 14: 07 GMT' });
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
        const productsBlock = document.querySelector('.cart__data');

        data.forEach(element => {
            cookiesSorted.forEach(productCookie => {
                let searchRequest = productCookie.split('=')[0],
                    searchRequestQuantity = productCookie.split('=')[1],
                    searchRequestArticle = fixString(productCookie.split('=')[0].split('__')[1], '_', ' '),
                    searchRequestBrand = fixString(productCookie.split('=')[0].split('__')[0], '_', ' ');

                if ((element.col1 != '') && (searchRequestArticle.length > 2) && (element.col2 == searchRequestArticle)) {
                    const productName = element.col4;
                    const productPrice = element.col6;
                    const productAvailibility = element.col8;
                    let productQuantity = searchRequestQuantity;
                    let productAttention = `
                    <svg class="search-data__icon search-data__icon_exclamation">
                        <use xlink:href="#exclamation"></use>
                    </svg >
                    <span class="search-data__text search-data__text_exclamation">
                        ???????????????????????? ?? ?????????????? (${productAvailibility}).
                        ???? ?????????????? ?????????????????????? ???????????????????? ?? ???????????????? ?? ????????.
                    </span>
                    `;
                    let activeExclamation = '';
                    if (productQuantity > productAvailibility) activeExclamation = '_active-exclamation';

                    let productTemplate = `
                <div data-id="${searchRequest}" data-quantity="${productAvailibility}" class="search-data__row">
                    <div class="search-data__block search-data__block_brand">
                        <span class="search-data__text search-data__text_brand">${searchRequestBrand} ${searchRequestArticle}</span>
                    </div>
                    <a href="product?id=${searchRequest}" class="search-data__block search-data__block_description">
                        <span class="search-data__text search-data__text_description">${productName}</span>
                    </a>
                    <div class="search-data__block search-data__block_price">
                        <span class="search-data__text search-data__text_price">${productPrice}???</span>
                    </div>
                    <div class="search-data__block search-data__block_quantity ${activeExclamation}">
                        <button class="search-data__button search-data__button_minus" type="button">-</button>
                        <span class="search-data__text search-data__text_quantity">${productQuantity}</span>
                        <button class="search-data__button search-data__button_plus" type="button">+</button>
                        ${productAttention}
                    </div>
                    <button class="search-data__button search-data__button_delete" type="button">
                        <svg class="search-data__icon search-data__icon_delete">
                            <use xlink:href="#delete"></use>
                        </svg >
                    </button>
                </div>
                `;
                    productsBlock.insertAdjacentHTML('afterbegin', productTemplate);
                }
            });
        });
        cartCover.style.display = 'none';
        calcFullPrice();
        fillTextarea();
    }

    function deleteRow(elementID) {
        const rowOnDelete = mainBlock.querySelector('.search-data__row[data-id="' + elementID + '"]');
        rowOnDelete.classList.add('_delete')
        if (rowOnDelete.querySelector('.search-data__delete-title') == null) {
            rowOnDelete.insertAdjacentHTML('beforeend', `
            <h2 class="search-data__delete-title">?????????? ?????????? ???????????? ???? ??????????????</h2>
            <button class="search-data__delete-button" type="button">
                <span class="search-data__text">????????????????????</span>
                <svg class="search-data__icon search-data__icon_delete">
                    <use xlink:href="#delete"></use>
                </svg >
            </button>
            <button class="search-data__cancel-button" type="button">
                <span class="search-data__text">????????????</span>
                <svg class="search-data__icon search-data__icon_cancel">
                    <use xlink:href="#cancel"></use>
                </svg >
            </button>
            `);
        }
    }

    function calcFullPrice() {
        const products = Array.from(document.querySelectorAll('.search-data__row'));
        let totalProductsPrice = 0;
        let totalProductsPriceNew = 0;
        let cartTotalPriceSpan = document.querySelector('.total__price-old'),
            cartTotalPriceNewSpan = document.querySelector('.total__price-new');
        products.forEach(product => {
            let price = product.querySelector('.search-data__text_price').innerHTML.split('???')[0],
                quantity = product.querySelector('.search-data__text_quantity').innerHTML;
            if (price.indexOf(',') != -1) price = price.split(',')[0] + price.split(',')[1];
            let totalPrice = +price * +quantity;
            totalProductsPrice += totalPrice;
        })
        totalProductsPriceNew = (totalProductsPrice * 0.95).toFixed(2);
        totalProductsPrice = numberCommas(`${totalProductsPrice}`);
        totalProductsPriceNew = numberCommas(`${totalProductsPriceNew}`);
        cartTotalPriceSpan.innerHTML = `${totalProductsPrice}???`;
        cartTotalPriceNewSpan.innerHTML = `${totalProductsPriceNew}???`;
    }

    function fillTextarea() {
        const products = Array.from(document.querySelectorAll('.search-data__row'));
        const textArea = document.querySelector('.form-cart__input_hidden');
        const fullPrice = document.querySelector('.total__price-old').innerHTML;
        const fullPriceNew = document.querySelector('.total__price-new').innerHTML;
        textArea.innerHTML = '';

        products.forEach(product => {
            const productArticleNumber = product.querySelector('.search-data__text_brand').innerHTML;
            const productQuantity = product.querySelector('.search-data__text_quantity').innerHTML;

            textArea.insertAdjacentText('afterbegin', `??????????: ${productArticleNumber}, ????????????????????: ${productQuantity};\n`);
        })
        textArea.insertAdjacentText('beforeend', `?????????? ????????: ${fullPrice}; \n`);
        textArea.insertAdjacentText('beforeend', `?????????? ???????? ???? ??????????????: ${fullPriceNew};`);
    }

    function numberCommas(price) {
        return price.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ",");
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
        //?????????? ???????????????? ?????????????????? ???????????????? ?? ???????????? ???? ?????? ?????????????????? ????????????????????
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