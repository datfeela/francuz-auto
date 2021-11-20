document.addEventListener('DOMContentLoaded', () => {
    const mainBlock = document.querySelector('.main__cart');
    const cartCounter = document.querySelector('.search-header__counter');
    const submitForm = document.querySelector('.form-cart');
    let cookies = document.cookie.split('; ');
    let cookiesSorted = [];

    cookies.map(function (element) {
        if (element.split('=')[0] != 'announcement' && element.split('=')[0] != 'totalQuantity' && element.split('=')[0] != 'theme') {
            cookiesSorted.push(element);
        }
    })

    getData();

    mainBlock.addEventListener('click', (event) => {
        const targetElement = event.target;

        //минус

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

        //плюс

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

        //удаление ряда

        if (targetElement.closest('.search-data__button_delete')) {
            const elementID = targetElement.closest('.search-data__button_delete').parentNode.dataset.id;
            deleteRow(elementID);
        }

        //отмена во всплывающем окне

        if (targetElement.closest('.search-data__cancel-button')) {
            targetElement.closest('.search-data__cancel-button').parentNode.classList.remove('_delete');
        }

        //полное удаление ряда во всплывающем окне

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
                cartCounter.innerHTML = '0';
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
        const productsBlock = document.querySelector('.cart__data'),
            cartCover = document.querySelector('.cart__cover');

        cookiesSorted.forEach(productCookie => {
            let searchRequest = productCookie.split('=')[0],
                searchRequestQuantity = productCookie.split('=')[1],
                searchRequestArticle = fixString(productCookie.split('=')[0].split('__')[1], '_', ' '),
                searchRequestBrand = fixString(productCookie.split('=')[0].split('__')[0], '_', ' ');

            console.log(searchRequest, '        ', searchRequestBrand, searchRequestArticle, searchRequestQuantity);
        })
        data.forEach(element => {
            cookiesSorted.forEach(productCookie => {
                let searchRequest = productCookie.split('=')[0],
                    searchRequestQuantity = productCookie.split('=')[1],
                    searchRequestArticle = fixString(productCookie.split('=')[0].split('__')[1], '_', ' '),
                    searchRequestBrand = fixString(productCookie.split('=')[0].split('__')[0], '_', ' ');

                if ((element.col1 != '') && (searchRequestArticle.length > 3) && (element.col2 == searchRequestArticle)) {
                    const productName = element.col4;
                    const productPrice = element.col6;
                    const productAvailibility = element.col8;
                    let productQuantity = searchRequestQuantity;
                    let productAttention = `
                    <svg class="search-data__icon search-data__icon_exclamation">
                        <use xlink:href="#exclamation"></use>
                    </svg >
                    <span class="search-data__text search-data__text_exclamation">
                        Недостаточно в наличии (${productAvailibility}).
                        Мы закажем необходимое количество и свяжемся с вами.
                    </span>
                    `;
                    let activeExclamation = '';
                    if (productQuantity > productAvailibility) activeExclamation = '_active-exclamation';

                    let productTemplate = `
                <div data-id="${searchRequest}" data-quantity="${productAvailibility}" class="search-data__row">
                    <div class="search-data__block search-data__block_brand">
                        <span class="search-data__text search-data__text_brand">${searchRequestBrand} ${searchRequestArticle}</span>
                    </div>
                    <a href="product.html?id=${searchRequest}" class="search-data__block search-data__block_description">
                        <span class="search-data__text search-data__text_description">${productName}</span>
                    </a>
                    <div class="search-data__block search-data__block_price">
                        <span class="search-data__text search-data__text_price">${productPrice}₽</span>
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
            <h2 class="search-data__delete-title">Товар будет удален из корзины</h2>
            <button class="search-data__delete-button" type="button">
                <span class="search-data__text">Продолжить</span>
                <svg class="search-data__icon search-data__icon_delete">
                    <use xlink:href="#delete"></use>
                </svg >
            </button>
            <button class="search-data__cancel-button" type="button">
                <span class="search-data__text">Отмена</span>
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
        let cartTotalPriceSpan = document.querySelector('.total__total-price');
        products.forEach(product => {
            let price = product.querySelector('.search-data__text_price').innerHTML.split('₽')[0],
                quantity = product.querySelector('.search-data__text_quantity').innerHTML;
            if (price.indexOf(',') != -1) price = price.split(',')[0] + price.split(',')[1];
            let totalPrice = +price * +quantity;
            totalProductsPrice += totalPrice;
        })
        totalProductsPrice = numberCommas(`${totalProductsPrice}`);
        cartTotalPriceSpan.innerHTML = `${totalProductsPrice}₽`;
    }

    function fillTextarea() {
        const products = Array.from(document.querySelectorAll('.search-data__row'));
        const textArea = document.querySelector('.form-cart__input_hidden');
        textArea.innerHTML = '';

        products.forEach(product => {
            const productArticleNumber = product.querySelector('.search-data__text_brand').innerHTML;
            const productQuantity = product.querySelector('.search-data__text_quantity').innerHTML;

            textArea.insertAdjacentText('beforeend', `Товар: ${productArticleNumber}, количество: ${productQuantity};   `);
        })
    }

    function numberCommas(price) {
        return price.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ",");
    }
})