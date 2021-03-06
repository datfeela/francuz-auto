document.addEventListener('DOMContentLoaded', () => {
    let searchRequest = new URL(location.href).searchParams.get('id');
    const productBlock = document.querySelector('.main__product'),
        head = document.querySelector('head'),
        title = document.querySelector('title');
    let searchRequestBrand = fixString(searchRequest.split('__')[0], '_', ' '),
        searchRequestArticle = fixString(searchRequest.split('__')[1], '_', ' '),
        cartCounter = document.querySelector('.search-header__counter');

    getData();

    productBlock.addEventListener('click', (event) => {
        const targetElement = event.target;
        if (targetElement.closest('.button-buy')) {
            targetElement.closest('.button-buy').setAttribute('disabled', true);
            event.preventDefault();
            changeQuantity(searchRequest, 1);
            changeQuantity('totalQuantity', 1);
            document.querySelector('.search-header__counter').innerHTML = +cartCounter.innerHTML + 1;
            if (cartCounter.innerHTML != '0') cartCounter.classList.add('_active');
            targetElement.closest('.button-buy').removeAttribute('disabled');
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
            if ((element.col1 != '') && (searchRequestArticle.length > 2) && (element.col1 == searchRequestBrand) && (element.col2 == searchRequestArticle)) {
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
                                    <span class="product__subtitle">??????????????????????????</span>
                                    <span class="product__text">${productBrand}</span>
                                </div>
                                <div class="product__article">
                                    <span class="product__subtitle">??????????????</span>
                                    <span class="product__text">${productArticleNumber}</span>
                                </div>
                            </div>
                            <div class="product__availibility">
                                <span class="product__price">${productPrice}???</span>
                                <span class="product__quantity">?? ?????????????? ${productQuantity} ????.</span>
                                <button class="product__button button-buy button" type="button">
                                    <svg class="button-buy__icon">
                                        <use xlink:href="#cart"></use>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `;
                    productBlock.insertAdjacentHTML('beforeend', productTemplate);
                    title.insertAdjacentHTML('beforeend', `??????????????-???????? | ${productName}`);
                    head.insertAdjacentHTML('beforeend', `<meta name="description" content="${productName} ?? ????????????????-???????????????? ??????????????-???????? ?? ?????????????????? ?? ?????????????????? ???? ???????????????????? ?? ??????????????. ???????????????????????? ?? ????????????????????????, ???????????????????????? ???????????????????????????????? ?? ??????????????????." />`);
                }
            }
        });

        if (productFound == true) productBlock.classList.add('_active');
    }

    // function fixArticle() {
    //     if (searchRequestArticle.indexOf('%20') != -1) {
    //         let count = 0;
    //         let newArticle = '';
    //         while (searchRequestArticle.split('%20')[count]) {
    //             newArticle += searchRequestArticle.split('%20')[count];
    //             count++;
    //             if (searchRequestArticle.split('%20')[count]) newArticle += ' ';
    //         }
    //         searchRequestArticle = newArticle;
    //     }
    // }
})