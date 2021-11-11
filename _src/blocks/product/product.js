document.addEventListener('DOMContentLoaded', () => {
    let searchRequest = location.search.slice(4);
    const productBlock = document.querySelector('.main__product'),
        head = document.querySelector('head'),
        title = document.querySelector('title'),
        searchRequestBrand = searchRequest.split('_')[0],
        searchRequestArticle = searchRequest.split('_')[1];
    let cartCounter = document.querySelector('.search-header__counter');

    getData();

    productBlock.addEventListener('click', (event) => {
        const targetElement = event.target;
        if (targetElement.closest('.button-buy')) {
            event.preventDefault();
            changeQuantity(searchRequest);
            changeQuantity('totalQuantity');
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
        let productFound = false;

        data.forEach(element => {
            if ((element.col1 != '') && (searchRequestArticle.length > 3) && (element.col1 == searchRequestBrand) && (element.col2 == searchRequestArticle)) {
                productFound = true;
                const productBrand = element.col1;
                const productName = element.col4;
                const productArticleNumber = element.col2;
                const productPrice = element.col6;
                const productQuantity = element.col8;


                $.ajax({
                    url: `img/product/${searchRequest}.webp`,
                    type: 'HEAD',
                    error: function () {
                        buildProductTemplate('no-image.webp');
                    },
                    success: function () {
                        buildProductTemplate(`${searchRequest}.webp`);
                    }
                })

                function buildProductTemplate(imgSrc) {
                    let productTemplate = `
                        <h1 class="product__name">${productName}</h1>
                        <div class="product__info">
                            <img class="product__image" src="img/product/${imgSrc}" alt="image" />
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
                                <button class="product__button button-buy button" type="button">
                                    <svg class="button-buy__icon">
                                        <use xlink:href="#cart"></use>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `;
                    productBlock.insertAdjacentHTML('beforeend', productTemplate);
                    title.insertAdjacentHTML('beforeend', `Француз-Авто | ${productName}`);
                    head.insertAdjacentHTML('beforeend', `<meta name="description" content="${productName} в интернет-магазине Француз-Авто с гарантией и доставкой по Челябинску и области. Ознакомиться с фотографиями, техническими характеристиками и описанием." />`);
                }
            }
        });

        if (productFound == true) productBlock.classList.add('_active');
    }
})