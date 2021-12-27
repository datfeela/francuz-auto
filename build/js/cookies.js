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
});